export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  addedAt: string;
  subtotal: number;
  category?: string;
}

export interface Cart {
  userId?: string;
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  total: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}
