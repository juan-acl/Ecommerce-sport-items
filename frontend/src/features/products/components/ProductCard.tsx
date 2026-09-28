import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@shared/components/ui/Button';
import { buildRoute } from '@shared/constants/routes';
import { formatCurrency } from '@shared/utils/formatCurrency';
import { getCategoryLabel } from '../constants/categories';
import type { Product } from '@shared/types/common';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: Readonly<ProductCardProps>) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <article className="group bg-white rounded-lg shadow-card overflow-hidden flex flex-col transition-all hover:shadow-cta">
      {/* Imagen + favorito */}
      <div className="relative aspect-square bg-surface-container-low overflow-hidden">
        <Link to={buildRoute.productDetail(product.id)}>
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-5xl">image_not_supported</span>
            </div>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          )}
        </Link>

        <button
          type="button"
          onClick={() => setIsFavorite((v) => !v)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-card flex items-center justify-center hover:bg-surface-container-low transition-colors"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </span>
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-on-surface text-label-md px-3 py-1.5 rounded-full uppercase tracking-wider">
              Agotado
            </span>
          </div>
        )}

        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 left-3">
            <span className="bg-error-container text-on-error-container text-label-md px-3 py-1 rounded-full">
              Últimas {product.stock} unidades
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-label-md text-secondary uppercase tracking-wider mb-2">
          {getCategoryLabel(product.category)}
        </span>

        <Link
          to={buildRoute.productDetail(product.id)}
          className="text-headline-sm text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-headline-md text-primary">{formatCurrency(product.price)}</span>

          {onAddToCart && !isOutOfStock && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(product)}
              aria-label={`Agregar ${product.name} al carrito`}
              className="!p-2.5 !rounded-full"
            >
              <span className="material-symbols-outlined">add_shopping_cart</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
