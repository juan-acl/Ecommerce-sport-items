import { ProductCard } from './ProductCard';
import { Skeleton } from '@shared/components/ui/Skeleton';
import type { Product } from '@shared/types/common';
import { v4 as uuid } from 'uuid';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onAddToCart }: Readonly<ProductGridProps>) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_) => (
        <div key={uuid()} className="bg-white rounded-lg shadow-card overflow-hidden">
          <Skeleton className="aspect-square w-full !rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-10 w-10 !rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
