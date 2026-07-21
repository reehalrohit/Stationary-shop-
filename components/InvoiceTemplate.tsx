import { formatRupee } from '../lib/utils';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface InvoiceProps {
  cart: CartItem[];
  total: number;
  invoiceNo: string;
  date: string;
}

export default function InvoiceTemplate({ cart, total, invoiceNo, date }: InvoiceProps) {
  return (
    <div id="print-section" className="w-[80mm] bg-white text-black text-sm font-mono mx-auto pb-8">
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg">STATIONARY HUB</h2>
        <p className="text-xs">Main Market Road</p>
        <p className="text-xs">GSTIN: 03XXXXX0000X1Z5</p>
      </div>
      
      <div className="border-b border-dashed border-black pb-2 mb-2 text-xs">
        <p>Bill No: {invoiceNo}</p>
        <p>Date: {date}</p>
      </div>
      
      <table className="w-full text-left mb-2 text-xs">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="py-1">Item</th>
            <th className="py-1 text-center">Qty</th>
            <th className="py-1 text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td className="py-1 truncate max-w-[40mm]">{item.name}</td>
              <td className="py-1 text-center">{item.quantity}</td>
              <td className="py-1 text-right">{formatRupee(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="border-t border-dashed border-black pt-2 text-right">
        <h3 className="font-bold text-base">Total: {formatRupee(total)}</h3>
      </div>
      
      <div className="text-center mt-6 text-xs">
        <p>Thank you for your visit!</p>
        <p>No returns on opened pens.</p>
      </div>
    </div>
  );
}
