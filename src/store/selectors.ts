import { createSelector } from '@reduxjs/toolkit';
import { findProduct, PRODUCTS } from '../data/products';
import { calculateTotals, findCoupon, isCouponEligible } from '../utils/pricing';
import type { RootState } from './index';

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCouponCode = (state: RootState) => state.cart.couponCode;
export const selectFilters = (state: RootState) => state.filters;

/** Itens do carrinho já com os dados do produto (descarta ids que não existem mais). */
export const selectDetailedCart = createSelector([selectCartItems], (items) =>
  items.flatMap((item) => {
    const product = findProduct(item.productId);
    return product ? [{ ...item, product, lineTotal: product.priceInCents * item.quantity }] : [];
  }),
);

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectQuantityInCart = (state: RootState, productId: number) =>
  state.cart.items.find((item) => item.productId === productId)?.quantity ?? 0;

export const selectCoupon = createSelector([selectCouponCode], (code) =>
  code ? findCoupon(code) : undefined,
);

export const selectTotals = createSelector([selectDetailedCart, selectCoupon], (lines, coupon) =>
  calculateTotals(
    lines.reduce((sum, line) => sum + line.lineTotal, 0),
    coupon,
  ),
);

/** Cupom aplicado, mas o carrinho ainda não atingiu o valor mínimo dele. */
export const selectCouponPending = createSelector([selectCoupon, selectTotals], (coupon, totals) =>
  Boolean(coupon && !isCouponEligible(coupon, totals.subtotal)),
);

export const selectVisibleProducts = createSelector([selectFilters], ({ search, category, sort }) => {
  const term = search.trim().toLocaleLowerCase('pt-BR');
  const filtered = PRODUCTS.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      (!term ||
        product.name.toLocaleLowerCase('pt-BR').includes(term) ||
        product.description.toLocaleLowerCase('pt-BR').includes(term)),
  );

  const sorted = [...filtered];
  if (sort === 'price-asc') sorted.sort((a, b) => a.priceInCents - b.priceInCents);
  if (sort === 'price-desc') sorted.sort((a, b) => b.priceInCents - a.priceInCents);
  if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
});
