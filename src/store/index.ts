import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import cart, { initialCartState, type CartState } from './cartSlice';
import filters from './filtersSlice';
import orders from './ordersSlice';
import ui from './uiSlice';
import { findProduct } from '../data/products';

const rootReducer = combineReducers({ cart, filters, orders, ui });
export type RootState = ReturnType<typeof rootReducer>;

const STORAGE_KEY = 'loja-coruja:cart';

/** Lê o carrinho salvo e descarta qualquer dado inválido ou produto que não existe mais. */
export const loadCart = (): CartState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialCartState;
    const parsed = JSON.parse(raw) as Partial<CartState>;
    const items = Array.isArray(parsed.items)
      ? parsed.items.filter((item) => {
          const product = findProduct(Number(item?.productId));
          return product && Number.isInteger(item.quantity) && item.quantity > 0;
        }).map((item) => ({
          productId: item.productId,
          quantity: Math.min(item.quantity, findProduct(item.productId)!.stock),
        }))
      : [];
    return { items, couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode : null };
  } catch {
    return initialCartState;
  }
};

const saveCart = (cart: CartState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Sem localStorage (ex.: navegação privada): o carrinho só não é lembrado.
  }
};

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState ?? { cart: loadCart() },
  });

  let lastCart = store.getState().cart;
  store.subscribe(() => {
    const { cart } = store.getState();
    if (cart !== lastCart) {
      lastCart = cart;
      saveCart(cart);
    }
  });

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
