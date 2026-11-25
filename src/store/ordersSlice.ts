import { createAction, createSlice } from '@reduxjs/toolkit';
import type { Order } from '../types';

/** Ação compartilhada: registra o pedido e (no cartSlice) esvazia o carrinho. */
export const placeOrder = createAction<Order>('orders/placeOrder');

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { history: [] as Order[] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(placeOrder, (state, action) => {
      state.history.unshift(action.payload);
    });
  },
});

export default ordersSlice.reducer;
