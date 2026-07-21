'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import InvoiceTemplate from '../components/InvoiceTemplate';
import { stationaryProducts } from '../lib/products';
import { formatRupee, generateInvoiceNumber } from '../lib/utils';

export default function POSDashboard() {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  const handlePrint = () => {
    window.print();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentInvoiceNo = generateInvoiceNumber();
  const currentDate = new Date().toLocaleDateString('en-IN');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Main App Layout (Hidden during printing) */}
      <main className="flex-grow flex p-4 gap-4 print:hidden">
        
        {/* Left Side: Product Catalog */}
        <div className="w-2/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            {stationaryProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="border p-4 rounded hover:bg-blue-50 hover:border-blue-500 transition text-left flex flex-col h-full"
              >
                <span className="text-xs text-gray-500 mb-1">{product.category}</span>
                <span className="font-semibold text-sm flex-grow">{product.name}</span>
                <span className="text-blue-600 font-bold mt-2">{formatRupee(product.price)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Cart Summary */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow flex flex-col">
          <h2 className="text-lg font-bold mb-4">Current Bill</h2>
          
          <div className="flex-grow overflow-y-auto mb-4 border-b pb-2">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm italic">Cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatRupee(item.price)} x {item.quantity}</p>
                  </div>
                  <p className="font-bold">{formatRupee(item.price * item.quantity)}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center mb-6 text-xl">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-blue-700">{formatRupee(total)}</span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={clearCart}
              className="w-1/3 bg-red-100 text-red-600 py-3 rounded font-semibold hover:bg-red-200"
            >
              Clear
            </button>
            <button 
              onClick={handlePrint}
              disabled={cart.length === 0}
              className="w-2/3 bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-300"
            >
              Print Bill
            </button>
          </div>
        </div>
      </main>

      {/* Hidden Invoice Template (Only visible when printing) */}
      <div className="hidden print:block">
        <InvoiceTemplate 
          cart={cart} 
          total={total} 
          invoiceNo={currentInvoiceNo} 
          date={currentDate} 
        />
      </div>
    </div>
  );
                    }
              
