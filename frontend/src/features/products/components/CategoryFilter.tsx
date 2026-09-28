import { CATEGORIES } from '../constants/categories';
import { cn } from '@shared/utils/cn';

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (category?: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: Readonly<CategoryFilterProps>) {
  return (
    <>
      <aside className="hidden lg:block bg-white rounded-lg p-6 shadow-card sticky top-24 self-start">
        <h2 className="text-headline-sm text-on-surface mb-4">Categorías</h2>

        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange(undefined)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md transition-colors text-left',
                selectedCategory
                  ? 'text-on-surface-variant hover:bg-surface-container-low'
                  : 'bg-primary text-white font-semibold',
              )}
            >
              <span className="material-symbols-outlined text-lg">apps</span>
              Todas
            </button>
          </li>

          {CATEGORIES.map((category) => (
            <li key={category.value}>
              <button
                type="button"
                onClick={() => onCategoryChange(category.value)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body-md transition-colors text-left',
                  selectedCategory === category.value
                    ? 'bg-primary text-white font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low',
                )}
              >
                <span className="material-symbols-outlined text-lg">{category.icon}</span>
                {category.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="lg:hidden -mx-6 px-6 mb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => onCategoryChange(undefined)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-body-md whitespace-nowrap transition-colors flex-shrink-0',
              selectedCategory
                ? 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container-low'
                : 'bg-primary text-white font-semibold',
            )}
          >
            <span className="material-symbols-outlined text-base">apps</span>
            Todas
          </button>

          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => onCategoryChange(category.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-body-md whitespace-nowrap transition-colors flex-shrink-0',
                selectedCategory === category.value
                  ? 'bg-primary text-white font-semibold'
                  : 'bg-white text-on-surface-variant border border-outline-variant hover:bg-surface-container-low',
              )}
            >
              <span className="material-symbols-outlined text-base">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
