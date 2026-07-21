export default function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md print:hidden">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">Stationary Hub POS</h1>
        <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Active Register</span>
      </div>
    </nav>
  );
}
