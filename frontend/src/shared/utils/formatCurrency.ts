export function formatCurrency(amount: number, currency = 'GTQ'): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
