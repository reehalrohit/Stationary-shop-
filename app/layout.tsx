import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Ajay Stationary Hub POS',
  description: 'Point of Sale and Billing System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Using Next.js Script to bypass security blocks and force styles */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
