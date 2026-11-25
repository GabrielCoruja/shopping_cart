import { CATEGORIES } from '../data/products';
import { useAppDispatch, useAppSelector } from '../store';
import { addItem, decrementItem } from '../store/cartSlice';
import { selectQuantityInCart } from '../store/selectors';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { QuantityStepper } from './QuantityStepper';

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector((state) => selectQuantityInCart(state, product.id));
  const reachedLimit = quantity >= product.stock;

  return (
    <article className="card" aria-labelledby={`produto-${product.id}`}>
      <div className={`card__image card__image--${product.category}`} aria-hidden="true">
        {product.emoji}
      </div>
      <div className="card__body">
        <p className="card__category">{CATEGORIES[product.category]}</p>
        <h3 id={`produto-${product.id}`} className="card__title">{product.name}</h3>
        <p className="card__description">{product.description}</p>
        <p className="card__rating" aria-label={`Avaliação ${product.rating.toFixed(1)} de 5`}>
          ★ {product.rating.toFixed(1).replace('.', ',')}
        </p>
      </div>
      <div className="card__footer">
        <strong className="card__price">{formatPrice(product.priceInCents)}</strong>
        {quantity === 0 ? (
          <button type="button" className="button" onClick={() => dispatch(addItem(product.id))}>
            Adicionar <span className="visually-hidden">{product.name}</span>
          </button>
        ) : (
          <QuantityStepper
            name={product.name}
            quantity={quantity}
            max={product.stock}
            onIncrement={() => dispatch(addItem(product.id))}
            onDecrement={() => dispatch(decrementItem(product.id))}
          />
        )}
      </div>
      {reachedLimit && <p className="card__limit">Limite de {product.stock} por pedido</p>}
    </article>
  );
}
