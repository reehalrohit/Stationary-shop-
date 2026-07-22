'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

const mergeDuplicates = (items: any[]) => {
  const merged: Record<string, any> = {};
  
  items.forEach((item) => {
    const cleanName = item.name.trim().toLowerCase();
    if (merged[cleanName]) {
      merged[cleanName].qty += Number(item.qty);
      merged[cleanName].price = Math.max(merged[cleanName].price, Number(item.price));
    } else {
      merged[cleanName] = { name: item.name.trim(), qty: Number(item.qty), price: Number(item.price) };
    }
  });
  return Object.values(merged);
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};

export default function AddStockAutomated() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processInvoice = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const compressedBase64 = await compressImage(file);
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error("Missing API Key! Please add NEXT_PUBLIC_OPENROUTER_API_KEY in Vercel.");
      }

      const prompt = `Extract all items from this invoice into a strict JSON array of objects. Each object must have keys: "name" (string), "qty" (number), "price" (number). Output ONLY raw JSON.`;

      // Direct Browser-to-AI Fetch: Bypasses Vercel's 15-second 504 Timeout rule entirely!
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://stationary-shop-taupe.vercel.app",
          "X-Title": "Ajay Stationary Hub POS"
        },
        body: JSON.stringify({
          model: "google/gemma-4-26b-a4b-it:free",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: compressedBase64 } }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`AI provider busy (Status ${response.status}). Please wait a moment and tap extract again.`);
      }

      const result = await response.json();
      const textResponse = result.choices[0].message.content;
      const jsonMatch = textResponse.match(/\[[\s\S]*\]/) || textResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) throw new Error("AI did not return valid JSON");

      const extractedData = JSON.parse(jsonMatch[0]);
      const cleanedData = mergeDuplicates(extractedData);
      setExtractedItems(cleanedData);

    } catch (error: any) {
      alert(`SYSTEM ERROR:\n${error.message}`);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...extractedItems];
    updated[index][field] = field === 'name' ? value : Number(value);
    setExtractedItems(updated);
  };

  const confirmAndAddToInventory = async () => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: extractedItems }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save to database');

      alert(`Successfully saved ${extractedItems.length} items to live inventory database!`);
      setExtractedItems([]);
      setFile(null);
    } catch (error: any) {
      alert(`Error saving stock: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Auto-Process Supplier Invoice</h2>

        {/* Upload Zone */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Invoice (Image or PDF)</label>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button 
              onClick={processInvoice}
              disabled={!file || isProcessing}
              className="bg-blue-600 text-white w-full md:w-auto px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 whitespace-nowrap"
            >
              {isProcessing ? 'Reading Invoice...' : 'Extract Items'}
            </button>
          </div>
        </div>

                {/* Verification Table */}
        {extractedItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-green-700 flex items-center gap-2">
              <span>✓</span> Extraction Complete (Duplicates Merged)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse mb-6 min-w-[600px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-2 font-semibold">Detected Item Name</th>
                    <th className="p-2 font-semibold text-center">Qty</th>
                    <th className="p-2 font-semibold text-right text-gray-500">Wholesale (₹)</th>
                    <th className="p-2 font-semibold text-right text-green-700">Set MRP (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                          className="w-full border-none outline-none focus:ring-1 focus:ring-blue-400 bg-transparent" 
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          className="w-16 text-center border-none outline-none focus:ring-1 focus:ring-blue-400 bg-transparent" 
                        />
                      </td>
                      <td className="p-2 text-right text-gray-500">
                        <input 
                          type="number" 
                          value={item.price} 
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          className="w-20 text-right border-none outline-none focus:ring-1 focus:ring-blue-400 bg-transparent" 
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input 
                          type="number" 
                          value={item.mrp || item.price} 
                          onChange={(e) => handleItemChange(index, 'mrp', e.target.value)}
                          className="w-24 text-right border rounded border-green-300 outline-none focus:ring-2 focus:ring-green-500 bg-green-50 font-bold text-green-700 p-1" 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

                <button 
              onClick={confirmAndAddToInventory}
              className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 transition shadow-sm"
            >
              Confirm & Add to Live Inventory
            </button>
          </div>
        )}
      </main>

      {/* 🚀 NEW FOOTER */}
      <footer className="w-full text-center py-6 mt-auto print:hidden">
        <p className="text-gray-500 font-medium text-sm tracking-wide">
          Made by <span className="font-bold text-gray-700">Rohit</span>
        </p>
      </footer>

    </div>
  );
}
