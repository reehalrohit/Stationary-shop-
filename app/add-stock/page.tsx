'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

// 1. New Helper Function: Merges duplicates and adds their quantities
const mergeDuplicates = (items: any[]) => {
  const merged: Record<string, any> = {};
  
  items.forEach((item) => {
    // Convert to lowercase to catch identical items with different capitalization
    const cleanName = item.name.trim().toLowerCase();
    
    if (merged[cleanName]) {
      // Item exists: Add the quantities together
      merged[cleanName].qty += Number(item.qty);
      // Keep the most recent/highest price to protect your profit margins
      merged[cleanName].price = Math.max(merged[cleanName].price, Number(item.price));
    } else {
      // New item: Add it to the list
      merged[cleanName] = { 
        name: item.name.trim(), // Preserve original capitalization for the screen
        qty: Number(item.qty), 
        price: Number(item.price) 
      };
    }
  });
  
  // Convert the cleaned object back into a standard array
  return Object.values(merged);
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
      const formData = new FormData();
      formData.append('file', file);

      // Send the image to your AI backend route
      const response = await fetch('/api/extract-invoice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to read invoice');

      const data = await response.json();
      
      // 2. Apply the Duplicate Removal filter before setting the state!
      const cleanedData = mergeDuplicates(data.items);
      setExtractedItems(cleanedData);
      
        } catch (error: any) {
      alert(error.message || "Error reading invoice. Please make sure the image is clear.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
    
  };

  const confirmAndAddToInventory = () => {
    // Later, this will send the clean array to your real database
    alert(`Successfully processed! ${extractedItems.length} unique items added to inventory.`);
    setExtractedItems([]);
    setFile(null);
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
              <table className="w-full text-left border-collapse mb-6 min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-2 font-semibold">Detected Item Name</th>
                    <th className="p-2 font-semibold text-center">Total Qty</th>
                    <th className="p-2 font-semibold text-right">Unit Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {extractedItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2">
                        <input type="text" defaultValue={item.name} className="w-full border-none outline-none focus:ring-1 focus:ring-blue-400 bg-transparent" />
                      </td>
                      <td className="p-2 text-center">
                        <input type="number" defaultValue={item.qty} className="w-16 text-center border-none outline-none focus:ring-1 focus:ring-blue-400 bg-transparent" />
                      </td>
                      <td className="p-2 text-right">
                        <input type="number" defaultValue={item.price} className="w-20 text-right border-none outline-none focus:ring-1 focus:ring-blue-400 bg-transparent" />
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
    </div>
  );
            }
                
