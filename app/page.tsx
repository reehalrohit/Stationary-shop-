'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import A4Invoice from '../components/A4Invoice';

export default function BillingPOS() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory', { cache: 'no-store' });
        const data = await response.json();
        if (data.items) {
          setInventory(data.items);
        }
      } catch (error) {
        console.error("Failed to load inventory", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      // If it's already in the cart, just add 1 to the quantity
      setCart(cart.map(cartItem => 
        cartItem.name === item.name ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
      ));
    } else {
      // New item in cart: Default Qty to 1, and temporarily set MRP to wholesale price so you can edit it
      setCart([...cart, { ...item, qty: 1, price: Number(item.price), mrp: Number(item.price) }]);
    }
  };

  // Function to let you edit Qty and MRP directly in the cart
  const updateCartItem = (itemName: string, field: string, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setCart(cart.map(item => 
      item.name === itemName ? { ...item, [field]: numValue } : item
    ));
  };

  const removeFromCart = (itemName: string) => {
    setCart(cart.filter(item => item.name !== itemName));
  };

  // The final total is now calculated strictly using the MRP, NOT the wholesale price!
  const total = cart.reduce((sum, item) => sum + (Number(item.qty) * Number(item.mrp)), 0);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="print:hidden">
         <Navbar />
      </div>
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 print:hidden">
        
        {/* LEFT SIDE: Live Inventory Catalog */}
        <div className="bg-white p-6 rounded-lg shadow-md h-[80vh] flex flex-col border-t-4 border-blue-900">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Stock Catalog</h2>
          
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="overflow-y-auto flex-grow border rounded-lg">
            {isLoading ? (
              <p className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading live stock...</p>
            ) : (
              <ul className="divide-y">
                {filteredInventory.map((item, idx) => (
                  <li key={idx} className="p-4 flex justify-between items-center hover:bg-blue-50 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">In Stock: {item.qty}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Wholesale</p>
                        <p className="font-bold text-gray-600">₹{Number(item.price).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 active:scale-95 transition"
                      >
                        Add
                      </button>
                    </div>
                  </li>
                ))}
                {filteredInventory.length === 0 && (
                  <p className="p-4 text-center text-gray-500">No items found.</p>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Cart & Checkout (Editable MRP) */}
        <div className="bg-white p-6 rounded-lg shadow-md h-[80vh] flex flex-col border-t-4 border-green-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Bill</h2>
          
          <div className="overflow-y-auto flex-grow border rounded-lg mb-4 bg-gray-50">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Cart is empty. Add items from inventory.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {cart.map((item, idx) => (
                  <li key={idx} className="p-4 flex flex-col gap-3 bg-white">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <button onClick={() => removeFromCart(item.name)} className="text-red-500 font-bold hover:text-red-700 px-2">✕</button>
                    </div>
                    
                    {/* Controls to edit Qty and MRP */}
                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">Qty:</label>
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => updateCartItem(item.name, 'qty', e.target.value)}
                          className="w-16 border rounded p-1 text-center outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 font-medium">MRP (₹):</label>
                        <input 
                          type="number" 
                          value={item.mrp} 
                          onChange={(e) => updateCartItem(item.name, 'mrp', e.target.value)}
                          className="w-24 border rounded p-1 text-right font-bold text-green-700 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-xs text-gray-400 italic">Cost: ₹{Number(item.price).toFixed(2)} (Hidden from bill)</p>
                      <p className="font-bold text-gray-800">Total: ₹{(Number(item.qty) * Number(item.mrp)).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-xl font-bold text-gray-700">Final Bill Amount:</span>
              <span className="text-3xl font-bold text-green-600">₹{total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => window.print()}
              disabled={cart.length === 0}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 shadow-md transition"
            >
              Print Customer Invoice
            </button>
          </div>
        </div>
      </main>

      {/* Hidden A4 Print Component */}
      <div className="hidden print:block">
        <A4Invoice cart={cart} total={total} />
      </div>
      
    </div>
  );
                                           }
                    
