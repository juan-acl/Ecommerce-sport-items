import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { selectIsAuthenticated } from '@features/auth/store/authSlice';
import { selectLocalCartItems, clearLocalCart } from '../store/cartSlice';
import { useAddToCartMutation } from '../api/cartApi';

/**
 * Sincroniza el carrito local al backend cuando hay sesión activa.
 *
 * Estrategia: si hay sesión Y hay items en el carrito local,
 * los sincroniza al backend y limpia el local. Usa una ref para
 * garantizar que la sincronización solo se ejecuta una vez por sesión,
 * incluso si el componente que invoca el hook se desmonta y vuelve a montar.
 */
export function useCartSync() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const localItems = useAppSelector(selectLocalCartItems);
  const [addToCart] = useAddToCartMutation();

  // Evita que el sync se dispare múltiples veces si los datos cambian durante la operación
  const isSyncingRef = useRef(false);

  useEffect(() => {
    // Condiciones para sincronizar:
    // 1. Hay sesión activa
    // 2. Hay items locales para sincronizar
    // 3. No estamos ya sincronizando
    if (!isAuthenticated || localItems.length === 0 || isSyncingRef.current) {
      return;
    }

    const sync = async () => {
      isSyncingRef.current = true;

      // Capturamos los items en una constante local porque pueden cambiar mientras sincronizamos
      const itemsToSync = [...localItems];
      const total = itemsToSync.length;
      let succeeded = 0;
      let failed = 0;

      for (const item of itemsToSync) {
        try {
          await addToCart({
            productId: item.productId,
            quantity: item.quantity,
          }).unwrap();
          succeeded += 1;
        } catch (err) {
          console.error('[useCartSync] Error sincronizando item', item.productId, err);
          failed += 1;
        }
      }

      // Limpiamos el carrito local solo después de intentar todos los items
      dispatch(clearLocalCart());

      if (succeeded > 0 && failed === 0) {
        toast.success(`${total} producto(s) sincronizado(s) con tu cuenta`);
      } else if (succeeded > 0 && failed > 0) {
        toast.warning(
          `Se sincronizaron ${succeeded} de ${total} productos. ${failed} no estaban disponibles.`,
        );
      } else if (failed > 0) {
        toast.error('No se pudieron sincronizar los productos del carrito');
      }

      isSyncingRef.current = false;
    };

    sync();
    // No incluyo localItems en las deps a propósito: queremos que reaccione SOLO al cambio
    // de auth o al primer mount con items, no a cada modificación del carrito local
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
}
