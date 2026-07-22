import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md print:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">Ajay Stationary Hub</h1>
        
        {/* Navigation Links */}
        <div className="flex gap-4 font-semibold text-sm">
          <Link href="/" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-600 transition">
            Billing POS
          </Link>
          <Link href="/add-stock" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-600 transition">
            + Add Stock
          </Link>
        </div>
        
      </div>
    </nav>
  );
}
