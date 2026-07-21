export function formatRupee(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber() {
  // Generates a simple sequential number based on the current timestamp
  return `INV-${Date.now().toString().slice(-6)}`;
}
