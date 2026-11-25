import type { Category, Product } from '../types';

export const CATEGORIES: Record<Category, string> = {
  eletronicos: 'Eletrônicos',
  casa: 'Casa e cozinha',
  bebidas: 'Bebidas',
  acessorios: 'Acessórios',
  esportes: 'Esportes',
};

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Fone de ouvido', description: 'Fone bluetooth com cancelamento de ruído e 30 h de bateria.', priceInCents: 20989, category: 'eletronicos', emoji: '🎧', stock: 5, rating: 4.6 },
  { id: 2, name: 'Vinho do Porto', description: 'Tawny 10 anos, notas de frutas secas e caramelo. 750 ml.', priceInCents: 15700, category: 'bebidas', emoji: '🍷', stock: 5, rating: 4.8 },
  { id: 3, name: 'Copo Lagoinha', description: 'O clássico copo americano de 190 ml. Kit com 6 unidades.', priceInCents: 3445, category: 'casa', emoji: '🥛', stock: 10, rating: 4.9 },
  { id: 4, name: 'Teclado mecânico', description: 'Switches táteis, layout ABNT2 e iluminação RGB.', priceInCents: 34990, category: 'eletronicos', emoji: '⌨️', stock: 3, rating: 4.7 },
  { id: 5, name: 'Café especial', description: 'Grãos 100% arábica do Sul de Minas, torra média. 500 g.', priceInCents: 4990, category: 'bebidas', emoji: '☕', stock: 8, rating: 4.9 },
  { id: 6, name: 'Bola de futebol', description: 'Bola oficial de campo, costurada à mão, tamanho 5.', priceInCents: 12990, category: 'esportes', emoji: '⚽', stock: 4, rating: 4.5 },
  { id: 7, name: 'Mochila urbana', description: 'Compartimento para notebook de 15", resistente à água.', priceInCents: 18990, category: 'acessorios', emoji: '🎒', stock: 6, rating: 4.4 },
  { id: 8, name: 'Panela de ferro', description: 'Panela de ferro fundido de 24 cm, ideal para pão de queijo e feijão tropeiro.', priceInCents: 21900, category: 'casa', emoji: '🍳', stock: 2, rating: 4.8 },
  { id: 9, name: 'Tênis de corrida', description: 'Amortecimento leve para treinos de 5 a 21 km.', priceInCents: 39990, category: 'esportes', emoji: '👟', stock: 3, rating: 4.6 },
  { id: 10, name: 'Óculos de sol', description: 'Lentes polarizadas com proteção UV400.', priceInCents: 15990, category: 'acessorios', emoji: '🕶️', stock: 5, rating: 4.3 },
  { id: 11, name: 'Controle de videogame', description: 'Controle sem fio compatível com PC e consoles.', priceInCents: 29990, category: 'eletronicos', emoji: '🎮', stock: 4, rating: 4.7 },
  { id: 12, name: 'Garrafa térmica', description: 'Mantém a bebida gelada por 24 h ou quente por 12 h. 1 litro.', priceInCents: 8990, category: 'esportes', emoji: '🧊', stock: 7, rating: 4.5 },
];

export const findProduct = (id: number): Product | undefined =>
  PRODUCTS.find((product) => product.id === id);
