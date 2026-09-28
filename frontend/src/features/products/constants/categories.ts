export interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryOption[] = [
  { value: 'futbol', label: 'Fútbol', icon: 'sports_soccer' },
  { value: 'tenis', label: 'Tenis', icon: 'sports_tennis' },
  { value: 'fitness', label: 'Fitness', icon: 'fitness_center' },
  { value: 'ciclismo', label: 'Ciclismo', icon: 'directions_bike' },
  { value: 'running', label: 'Running', icon: 'directions_run' },
];

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryIcon(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.icon ?? 'category';
}
