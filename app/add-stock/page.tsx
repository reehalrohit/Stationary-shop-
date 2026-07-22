'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function AddStock() {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [supplier, setSupplier] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const handleAddStock = (e: any) => {
    e.preventDefault();
    
    // For now, this will show a success pop-up. 
    // Later, we will connect this to a database to permanently update your inventory!
    alert(`Stock Added Successfully!\n\nSupplier: ${supplier}\nItem: ${itemName}\nQty: ${quantity}\nCost: ₹${purchasePrice}`);
    
    // Clear the form for the next item on the invoice
    setItemName('');
    setQuantity('');
    setPurchasePrice('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-8 max-w-3xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Process Purchase Invoice</h2>

        <form onSubmit={handleAddStock} className="bg-white p-6 rounded-lg shadow-md space-y-4 border-t-4 border-blue-600">
          
          {/* Supplier Invoice Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-6 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Supplier Name</label>
              <input required type="text" className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="e.g., ITC Wholesale" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Invoice Number</label>
              <input required type="text" className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} placeholder="e.g., INV-8821" />
            </div>
          </div>

          {/* Individual Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700">Item Name</label>
              <input required type="text" className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Search or type item name..." />
            </div>
            
            {/* Optional: If you ever need to track batch numbers for items that dry out (like Fevicol or markers), you can easily add a batch input field here! */}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700">Quantity Received</label>
              <input required type="number" className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Purchase Price (Per Unit)</label>
              <input required type="number" className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} placeholder="₹" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 mt-6 rounded font-bold hover:bg-blue-700 transition shadow-sm">
            + Log Item to Inventory
          </button>
        </form>
      </main>
    </div>
  );
}
