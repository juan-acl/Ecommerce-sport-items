export interface CartItemSlice {
  category: string;
  unitPrice: number;
  quantity: number;
}

export function computeEffectiveSubtotal(
  applicableCategories: string[],
  items: CartItemSlice[],
  fallback: number,
): number {
  if (applicableCategories.length === 0 || items.length === 0) return fallback;
  const scoped = items.filter((i) => applicableCategories.includes(i.category));
  return scoped.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
}
