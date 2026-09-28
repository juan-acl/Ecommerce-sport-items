import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Cart } from '../types';
import type { Product } from '@shared/types/common';

interface LocalCartState {
  items: CartItem[];
}

const STORAGE_KEY = 'sportcart_local_cart';

function loadFromStorage(): LocalCartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as LocalCartState;
    return { items: parsed.items ?? [] };
  } catch {
    return { items: [] };
  }
}

function saveToStorage(state: LocalCartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage lleno o deshabilitado: silenciamos
  }
}

const initialState: LocalCartState = loadFromStorage();

const localCartSlice = createSlice({
  name: 'localCart',
  initialState,
  reducers: {
    addLocalItem: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);

      if (existing) {
        existing.quantity += quantity;
        existing.subtotal = existing.unitPrice * existing.quantity;
      } else {
        state.items.push({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity,
          imageUrl: product.imageUrl,
          addedAt: new Date().toISOString(),
          subtotal: product.price * quantity,
        });
      }

      saveToStorage(state);
    },

    updateLocalQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = quantity;
        item.subtotal = item.unitPrice * quantity;
        saveToStorage(state);
      }
    },

    removeLocalItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveToStorage(state);
    },

    clearLocalCart: (state) => {
      state.items = [];
      saveToStorage(state);
    },
  },
});

export const { addLocalItem, updateLocalQuantity, removeLocalItem, clearLocalCart } =
  localCartSlice.actions;

export default localCartSlice.reducer;

// Selector que devuelve el carrito local en el mismo formato que el backend
export const selectLocalCart = (state: { localCart: LocalCartState }): Cart => {
  const items = state.localCart.items;
  return {
    items,
    itemCount: items.length,
    totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
    total: items.reduce((sum, i) => sum + i.subtotal, 0),
  };
};

export const selectLocalCartItems = (state: { localCart: LocalCartState }) => state.localCart.items;
