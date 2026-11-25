import { calculateTotals, findCoupon, FREE_SHIPPING_FROM, SHIPPING_FEE } from './pricing';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formata centavos como reais', () => {
    expect(formatPrice(123456)).toBe('R$ 1.234,56');
    expect(formatPrice(0)).toBe('R$ 0,00');
  });
});

describe('findCoupon', () => {
  it('ignora maiúsculas e espaços', () => {
    expect(findCoupon('  coruja10 ')?.code).toBe('CORUJA10');
  });

  it('retorna undefined para cupom inexistente', () => {
    expect(findCoupon('NAOEXISTE')).toBeUndefined();
  });
});

describe('calculateTotals', () => {
  it('carrinho vazio não cobra frete', () => {
    expect(calculateTotals(0)).toEqual({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
  });

  it('cobra frete abaixo do valor mínimo', () => {
    expect(calculateTotals(10000)).toEqual({ subtotal: 10000, discount: 0, shipping: SHIPPING_FEE, total: 10000 + SHIPPING_FEE });
  });

  it('dá frete grátis a partir do valor mínimo', () => {
    expect(calculateTotals(FREE_SHIPPING_FROM).shipping).toBe(0);
  });

  it('aplica desconto percentual arredondado', () => {
    const totals = calculateTotals(36689, findCoupon('CORUJA10'));
    expect(totals.discount).toBe(3669);
    expect(totals.total).toBe(33020);
  });

  it('cupom de valor fixo respeita o subtotal mínimo', () => {
    expect(calculateTotals(9000, findCoupon('BEMVINDO20')).discount).toBe(0);
    expect(calculateTotals(10000, findCoupon('BEMVINDO20')).discount).toBe(2000);
  });

  it('cupom de frete grátis zera o frete', () => {
    expect(calculateTotals(5000, findCoupon('FRETEGRATIS'))).toMatchObject({ shipping: 0, total: 5000 });
  });
});
