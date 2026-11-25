import { PRODUCTS } from '../data/products';
import { addItem, applyCoupon, clearCart, decrementItem, removeItem } from './cartSlice';
import { setCategory, setSearch, setSort } from './filtersSlice';
import { loadCart, makeStore } from './index';
import { placeOrder } from './ordersSlice';
import { selectCartCount, selectTotals, selectVisibleProducts } from './selectors';

const fone = PRODUCTS.find((p) => p.name === 'Fone de ouvido')!;
const panela = PRODUCTS.find((p) => p.name === 'Panela de ferro')!; // estoque 2

describe('carrinho', () => {
  it('adiciona, soma quantidades e calcula o subtotal', () => {
    const store = makeStore();
    store.dispatch(addItem(fone.id));
    store.dispatch(addItem(fone.id));
    expect(selectCartCount(store.getState())).toBe(2);
    expect(selectTotals(store.getState()).subtotal).toBe(fone.priceInCents * 2);
  });

  it('não passa do estoque do produto', () => {
    const store = makeStore();
    for (let i = 0; i < 5; i += 1) store.dispatch(addItem(panela.id));
    expect(selectCartCount(store.getState())).toBe(panela.stock);
  });

  it('remove o item quando a quantidade chega a zero', () => {
    const store = makeStore();
    store.dispatch(addItem(fone.id));
    store.dispatch(decrementItem(fone.id));
    expect(store.getState().cart.items).toEqual([]);
  });

  it('remove item e esvazia o carrinho', () => {
    const store = makeStore();
    store.dispatch(addItem(fone.id));
    store.dispatch(addItem(panela.id));
    store.dispatch(removeItem(fone.id));
    expect(store.getState().cart.items).toHaveLength(1);
    store.dispatch(applyCoupon('CORUJA10'));
    store.dispatch(clearCart());
    expect(store.getState().cart).toEqual({ items: [], couponCode: null });
  });

  it('ignora cupom inexistente', () => {
    const store = makeStore();
    store.dispatch(applyCoupon('INVALIDO'));
    expect(store.getState().cart.couponCode).toBeNull();
  });

  it('fazer um pedido registra no histórico e esvazia o carrinho', () => {
    const store = makeStore();
    store.dispatch(addItem(fone.id));
    store.dispatch(placeOrder({
      id: 'LC-1', createdAt: '', couponCode: null,
      customer: { name: 'Teste', email: 't@t.com', cep: '00000-000', address: 'Rua 1', city: 'BH', payment: 'pix' },
      items: [], totals: { subtotal: 0, discount: 0, shipping: 0, total: 0 },
    }));
    expect(store.getState().cart.items).toEqual([]);
    expect(store.getState().orders.history[0].id).toBe('LC-1');
  });
});

describe('persistência', () => {
  it('salva o carrinho no localStorage e recupera em uma nova sessão', () => {
    const store = makeStore();
    store.dispatch(addItem(fone.id));
    store.dispatch(applyCoupon('coruja10'));
    expect(makeStore().getState().cart).toEqual({ items: [{ productId: fone.id, quantity: 1 }], couponCode: 'CORUJA10' });
  });

  it('descarta dados corrompidos ou produtos que não existem', () => {
    localStorage.setItem('loja-coruja:cart', JSON.stringify({ items: [{ productId: 999, quantity: 1 }, { productId: panela.id, quantity: 50 }, { productId: fone.id, quantity: -1 }] }));
    expect(loadCart().items).toEqual([{ productId: panela.id, quantity: panela.stock }]);
    localStorage.setItem('loja-coruja:cart', '{json quebrado');
    expect(loadCart()).toEqual({ items: [], couponCode: null });
  });
});

describe('filtros', () => {
  it('filtra por categoria e busca sem diferenciar maiúsculas', () => {
    const store = makeStore();
    store.dispatch(setCategory('bebidas'));
    expect(selectVisibleProducts(store.getState()).every((p) => p.category === 'bebidas')).toBe(true);
    store.dispatch(setCategory('all'));
    store.dispatch(setSearch('CAFÉ'));
    expect(selectVisibleProducts(store.getState()).map((p) => p.name)).toEqual(['Café especial']);
  });

  it('ordena por preço', () => {
    const store = makeStore();
    store.dispatch(setSort('price-asc'));
    const prices = selectVisibleProducts(store.getState()).map((p) => p.priceInCents);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
