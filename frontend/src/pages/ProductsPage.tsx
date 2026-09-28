import { useCart } from '@features/cart/hooks/useCart';
import { ProductGrid } from '@features/products/components/ProductGrid';
import { CategoryFilter } from '@features/products/components/CategoryFilter';
import { useProducts } from '@features/products/hooks/useProducts';
import { Button } from '@shared/components/ui/Button';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { getCategoryLabel } from '@features/products/constants/categories';

export function ProductsPage() {
  const { products, isLoading, isFetching, hasMore, loadMore, setCategory, selectedCategory } =
    useProducts();
  const { addItem } = useCart();

  const isInitialLoading = isLoading && products.length === 0;
  const isEmpty = !isInitialLoading && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-headline-lg text-on-surface mb-2">
          {selectedCategory ? `${getCategoryLabel(selectedCategory)}` : 'Todos los productos'}
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Equipamiento deportivo premium seleccionado para llevarte al siguiente nivel.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setCategory} />

        <section>
          {isEmpty ? (
            <EmptyState
              icon="inventory_2"
              title="No hay productos disponibles"
              description={
                selectedCategory
                  ? `No encontramos productos en la categoría "${getCategoryLabel(selectedCategory)}". Intenta con otra categoría.`
                  : 'Aún no hay productos cargados en el catálogo.'
              }
              action={
                selectedCategory ? (
                  <Button variant="outline" onClick={() => setCategory(undefined)}>
                    Ver todos los productos
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <ProductGrid
                products={products}
                isLoading={isInitialLoading}
                onAddToCart={(product) => addItem(product, 1)}
              />

              {hasMore && !isInitialLoading && (
                <div className="flex justify-center mt-12">
                  <Button variant="outline" size="lg" onClick={loadMore} isLoading={isFetching}>
                    Cargar más productos
                  </Button>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center mt-12 py-8 border-t border-outline-variant">
                  <p className="text-body-md text-on-surface-variant">
                    Has visto todos los productos disponibles
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
