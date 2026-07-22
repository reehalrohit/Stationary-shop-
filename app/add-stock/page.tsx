'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { formatRupee } from '../../lib/utils';

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

    // In a live app, this is where you send the image to your Next.js API route to be read by an AI vision model.
    // For now, we simulate the AI taking 2 seconds to read the uploaded invoice and returning structured data.
    setTimeout(() => {
      const mockAiExtraction = [
        { name: 'Classmate Spiral Notebook', qty: 50, price: 45 },
        { name: 'Reynolds Trimax Blue', qty: 100, price: 35 },
        { name: 'A4 Copier Paper Bundle', qty: 20, price: 320 }
      ];
      setExtractedItems(mockAiExtraction);
      setIsProcessing(false);
    }, 2000);
  };

  const confirmAndAddToInventory = () => {
    alert(`Successfully added ${extractedItems.length} items to your permanent inventory!`);
    setExtractedItems([]);
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Auto-Process Supplier Invoice</h2>

        {/* Step 1: Upload Zone */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Invoice (Image or PDF)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button 
              onClick={processInvoice}
              disabled={!file || isProcessing}
              className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 whitespace-nowrap"
            >
              {isProcessing ? 'Reading Invoice...' : 'Extract Items'}
            </button>
          </div>
        </div>

        {/* Step 2: Verification Table (Appears after AI processing) */}
        {extractedItems.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-green-700 flex items-center gap-2">
              <span>✓</span> Extraction Complete. Please Verify:
            </h3>
            
            <table className="w-full text-left border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 font-semibold">Detected Item Name</th>
                  <th className="p-2 font-semibold text-center">Qty</th>
                  <th className="p-2 font-semibold text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {extractedItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2">
                      <input type="text" defaultValue={item.name} className="w-full border-none outline-none focus:ring-1 focus:ring-blue-400" />
                    </td>
                    <td className="p-2 text-center">
                      <input type="number" defaultValue={item.qty} className="w-16 text-center border-none outline-none focus:ring-1 focus:ring-blue-400" />
                    </td>
                    <td className="p-2 text-right">
                      <input type="number" defaultValue={item.price} className="w-20 text-right border-none outline-none focus:ring-1 focus:ring-blue-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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
                
