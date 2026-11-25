import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { findProduct } from '../data/products';
import { findCoupon } from '../utils/pricing';
import type { CartItem } from '../types';
import { placeOrder } from './ordersSlice';

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
}

export const initialCartState: CartState = { items: [], couponCode: null };

const stockOf = (productId: number) => findProduct(productId)?.stock ?? 0;

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addItem(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.min(item.quantity + 1, stockOf(productId));
      } else if (stockOf(productId) > 0) {
        state.items.push({ productId, quantity: 1 });
      }
    },
    decrementItem(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
    },
    /** Só guarda cupons que existem; a validação de valor mínimo fica nos selectors. */
    applyCoupon(state, action: PayloadAction<string>) {
      const coupon = findCoupon(action.payload);
      if (coupon) state.couponCode = coupon.code;
    },
    removeCoupon(state) {
      state.couponCode = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder, () => initialCartState);
  },
});

export const { addItem, decrementItem, removeItem, clearCart, applyCoupon, removeCoupon } =
  cartSlice.actions;
export default cartSlice.reducer;
