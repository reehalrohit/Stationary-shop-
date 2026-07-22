export default function A4Invoice({ cart, total }: { cart: any[], total: number }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black shadow-lg my-6 print:shadow-none print:m-0 print:p-0">
      
      {/* Hidden button when printing */}
      <div className="mb-6 flex justify-end print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Print A4 Invoice
        </button>
      </div>

      {/* A4 Printable Sheet Container */}
      <div className="print:w-[210mm] print:min-h-[297mm] print:p-8">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ajay Stationary Hub</h2>
            <p className="text-sm text-gray-600">Complete Retail & Wholesale Stationary Store</p>
            <p className="text-sm text-gray-600">Contact: +91 XXXXX XXXXX</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold text-gray-800">INVOICE</h3>
            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Invoice #: INV-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
              <th className="py-3 px-2">#</th>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Unit Price (₹)</th>
              <th className="py-3 px-4 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-200">
            {cart.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-2 text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                <td className="py-3 px-4 text-center text-gray-600">{item.qty}</td>
                <td className="py-3 px-4 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-800">₹{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end border-t pt-4">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
              <span>Grand Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-xs text-gray-500 border-t pt-6">
          <p>Thank you for shopping at Ajay Stationary Hub! Visit again.</p>
        </div>

      </div>
    </div>
  );
          }
