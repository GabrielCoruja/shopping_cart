/** Regras de frete e cupons da loja. Todos os valores em centavos. */
export const SHIPPING_FEE = 1990;
export const FREE_SHIPPING_FROM = 19900;

export type Coupon =
  | { code: string; description: string; type: 'percent'; value: number; minSubtotal?: number }
  | { code: string; description: string; type: 'fixed'; value: number; minSubtotal?: number }
  | { code: string; description: string; type: 'free-shipping'; minSubtotal?: number };

export const COUPONS: Coupon[] = [
  { code: 'CORUJA10', description: '10% de desconto em todo o carrinho', type: 'percent', value: 10 },
  { code: 'BEMVINDO20', description: 'R$ 20 de desconto em compras a partir de R$ 100', type: 'fixed', value: 2000, minSubtotal: 10000 },
  { code: 'FRETEGRATIS', description: 'Frete grátis em qualquer valor', type: 'free-shipping' },
];

export const findCoupon = (code: string): Coupon | undefined =>
  COUPONS.find((coupon) => coupon.code === code.trim().toUpperCase());

export const isCouponEligible = (coupon: Coupon, subtotal: number): boolean =>
  subtotal >= (coupon.minSubtotal ?? 0);

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export const calculateTotals = (subtotal: number, coupon?: Coupon): Totals => {
  if (subtotal === 0) return { subtotal: 0, discount: 0, shipping: 0, total: 0 };

  const activeCoupon = coupon && isCouponEligible(coupon, subtotal) ? coupon : undefined;

  let discount = 0;
  if (activeCoupon?.type === 'percent') discount = Math.round((subtotal * activeCoupon.value) / 100);
  if (activeCoupon?.type === 'fixed') discount = Math.min(activeCoupon.value, subtotal);

  const freeShipping = subtotal >= FREE_SHIPPING_FROM || activeCoupon?.type === 'free-shipping';
  const shipping = freeShipping ? 0 : SHIPPING_FEE;

  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
};
