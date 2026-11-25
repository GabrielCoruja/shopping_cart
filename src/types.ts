export type Category = 'eletronicos' | 'casa' | 'bebidas' | 'acessorios' | 'esportes';

export interface Product {
  id: number;
  name: string;
  description: string;
  /** Preço em centavos, para evitar erros de arredondamento com float. */
  priceInCents: number;
  category: Category;
  emoji: string;
  /** Quantidade máxima que pode ir para o carrinho. */
  stock: number;
  rating: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export type PaymentMethod = 'pix' | 'cartao' | 'boleto';

export interface Customer {
  name: string;
  email: string;
  cep: string;
  address: string;
  city: string;
  payment: PaymentMethod;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: Customer;
  items: Array<CartItem & { name: string; priceInCents: number; emoji: string }>;
  couponCode: string | null;
  totals: OrderTotals;
}
