'use client';

export default function A4Invoice({ cart, total }: { cart: any[], total: number }) {
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-12 mx-auto font-sans">
      
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-6 mb-6">
        <h1 className="text-4xl font-extrabold uppercase tracking-wide">Ajay Stationary Hub</h1>
        <p className="text-lg mt-2 text-gray-700">Complete Retail & Wholesale Stationary</p>
        <p className="text-md text-gray-600">Contact: +91 XXXXX XXXXX</p>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold uppercase text-gray-800">Tax Invoice</h2>
          <p className="text-gray-600 mt-1">Customer Bill</p>
        </div>
        <div className="text-right">
          <p className="font-semibold"><span className="text-gray-600">Date:</span> {date}</p>
          <p className="font-semibold mt-1"><span className="text-gray-600">Invoice No:</span> #ASH-{Math.floor(1000 + Math.random() * 9000)}</p>
        </div>
      </div>

      {/* Items Table - STRICTLY MRP ONLY */}
      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-black">
            <th className="py-3 px-2 font-bold uppercase text-sm w-12 text-center">No.</th>
            <th className="py-3 px-2 font-bold uppercase text-sm">Item Description</th>
            <th className="py-3 px-2 font-bold uppercase text-sm text-center w-24">Qty</th>
            <th className="py-3 px-2 font-bold uppercase text-sm text-right w-32">MRP Rate (₹)</th>
            <th className="py-3 px-2 font-bold uppercase text-sm text-right w-32">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {cart.map((item, index) => (
            <tr key={index}>
              <td className="py-3 px-2 text-center text-gray-700">{index + 1}</td>
              <td className="py-3 px-2 font-medium">{item.name}</td>
              <td className="py-3 px-2 text-center">{item.qty}</td>
              <td className="py-3 px-2 text-right">{Number(item.mrp).toFixed(2)}</td>
              <td className="py-3 px-2 text-right font-semibold">{(Number(item.qty) * Number(item.mrp)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="flex justify-end border-t-2 border-black pt-4">
        <div className="w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-700">Subtotal:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-300 pt-2 text-xl">
            <span className="font-bold uppercase text-black">Grand Total:</span>
            <span className="font-extrabold text-black">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shop Policy Footer */}
      <div className="mt-20 border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
        <p>Thank you for shopping with Ajay Stationary Hub!</p>
        <p>Goods once sold cannot be returned or exchanged without a valid receipt.</p>
        <div className="mt-12 flex justify-end">
          <div className="text-center w-48">
            <div className="border-b border-black mb-2 h-8"></div>
            <p className="font-semibold text-black">Authorized Signatory</p>
          </div>
        </div>
      </div>

      {/* 🚀 Developer Credit (Prints at the very bottom) */}
      <div className="mt-16 text-center text-xs text-gray-500 font-medium tracking-wide">
        <p>Website development by Rohit</p>
        <p>CONTACT ON r10892040@gmail.com OR 9478509980</p>
      </div>

    </div>
  );
}
