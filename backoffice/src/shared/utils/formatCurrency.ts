export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount);
}
