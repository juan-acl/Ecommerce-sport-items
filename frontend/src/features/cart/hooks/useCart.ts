import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectIsAuthenticated } from '@features/auth/store/authSlice';
import {
  addLocalItem,
  removeLocalItem,
  updateLocalQuantity,
  selectLocalCart,
} from '../store/cartSlice';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useRemoveFromCartMutation,
} from '../api/cartApi';
import type { Cart } from '../types';
import type { Product } from '@shared/types/common';

const EMPTY_CART: Cart = { items: [], itemCount: 0, totalQuantity: 0, total: 0 };

export function useCart() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const localCart = useAppSelector(selectLocalCart);

  const {
    data: serverCart,
    isLoading: isServerLoading,
    isFetching: isServerFetching,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [addToServerCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [updateServerQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation();
  const [removeFromServerCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();

  const cart: Cart = isAuthenticated ? (serverCart ?? EMPTY_CART) : localCart;
  const isLoading = isAuthenticated ? isServerLoading : false;
  const isMutating = isAdding || isUpdating || isRemoving;

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      if (isAuthenticated) {
        try {
          await addToServerCart({ productId: product.id, quantity }).unwrap();
          toast.success(`${product.name} agregado al carrito`);
        } catch (err) {
          const error = err as { data?: { message?: string; code?: string } };
          if (error.data?.code === 'CONFLICT') {
            toast.error(error.data.message ?? 'Stock insuficiente');
          } else {
            toast.error('No se pudo agregar al carrito');
          }
        }
      } else {
        // Validación local de stock
        const existing = localCart.items.find((i) => i.productId === product.id);
        const newQuantity = (existing?.quantity ?? 0) + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Solo hay ${product.stock} unidades disponibles`);
          return;
        }
        dispatch(addLocalItem({ product, quantity }));
        toast.success(`${product.name} agregado al carrito`);
      }
    },
    [isAuthenticated, addToServerCart, dispatch, localCart.items],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) return;

      if (isAuthenticated) {
        try {
          await updateServerQuantity({ productId, quantity }).unwrap();
        } catch (err) {
          const error = err as { data?: { error: { message?: string; code?: string } } };
          toast.error(error.data?.error?.message ?? 'No se pudo actualizar la cantidad');
        }
      } else {
        dispatch(updateLocalQuantity({ productId, quantity }));
      }
    },
    [isAuthenticated, updateServerQuantity, dispatch],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        try {
          await removeFromServerCart(productId).unwrap();
          toast.success('Producto eliminado del carrito');
        } catch {
          toast.error('No se pudo eliminar el producto');
        }
      } else {
        dispatch(removeLocalItem(productId));
        toast.success('Producto eliminado del carrito');
      }
    },
    [isAuthenticated, removeFromServerCart, dispatch],
  );

  return {
    cart,
    isLoading,
    isFetching: isServerFetching,
    isMutating,
    addItem,
    updateQuantity,
    removeItem,
  };
}
