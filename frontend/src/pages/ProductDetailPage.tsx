import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetProductQuery } from '@features/products/api/productsApi';
import { Button } from '@shared/components/ui/Button';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { Badge } from '@shared/components/ui/Badge';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { ROUTES } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { getCategoryLabel } from '@features/products/constants/categories';
import { useCart } from '@/features/cart/hooks/useCart';

export function ProductDetailPage() {
  const { addItem } = useCart();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductQuery(id!, { skip: !id });
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <EmptyState
          icon="error"
          title="Producto no encontrado"
          description="El producto que buscas no existe o fue removido del catálogo."
          action={<Button onClick={() => navigate(ROUTES.PRODUCTS)}>Volver a productos</Button>}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, 99);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-body-md text-on-surface-variant mb-6">
        <Link to={ROUTES.PRODUCTS} className="hover:text-primary transition-colors">
          Productos
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-on-surface">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-card">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <Badge variant="secondary" className="mb-4 uppercase tracking-wider">
            {getCategoryLabel(product.category)}
          </Badge>

          <h1 className="text-headline-lg text-on-surface mb-4">{product.name}</h1>

          <p className="text-headline-md text-primary mb-6">{formatCurrency(product.price)}</p>

          <div className="prose prose-sm mb-8">
            <p className="text-body-lg text-on-surface-variant">{product.description}</p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {isOutOfStock ? (
              <Badge variant="error">Agotado</Badge>
            ) : product.stock < 5 ? (
              <Badge variant="error">
                <span className="material-symbols-outlined text-base">warning</span>
                Últimas {product.stock} unidades
              </Badge>
            ) : (
              <Badge variant="success">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {product.stock} disponibles
              </Badge>
            )}
          </div>

          {!isOutOfStock && (
            <>
              <div className="mb-8">
                <label className="block text-label-md text-on-surface-variant mb-2">Cantidad</label>
                <div className="inline-flex items-center border border-outline-variant rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-4 py-3 hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="px-6 py-3 text-body-lg font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                    disabled={quantity >= maxQuantity}
                    className="px-4 py-3 hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" fullWidth onClick={handleAddToCart}>
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  Agregar al carrito
                </Button>
              </div>
            </>
          )}

          <div className="mt-12 pt-8 border-t border-outline-variant space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">local_shipping</span>
              <div>
                <p className="text-body-md font-semibold text-on-surface">Envío disponible</p>
                <p className="text-label-md text-on-surface-variant">
                  Entrega estimada en 3-5 días hábiles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">verified</span>
              <div>
                <p className="text-body-md font-semibold text-on-surface">Producto auténtico</p>
                <p className="text-label-md text-on-surface-variant">Garantizado por SportCart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <Skeleton className="h-5 w-40 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
