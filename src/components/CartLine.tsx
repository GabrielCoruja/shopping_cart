import { useAppDispatch } from '../store';
import { addItem, decrementItem, removeItem } from '../store/cartSlice';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { QuantityStepper } from './QuantityStepper';

interface Props {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export function CartLine({ product, quantity, lineTotal }: Props) {
  const dispatch = useAppDispatch();

  return (
    <li className="cart-line">
      <span className={`cart-line__image card__image--${product.category}`} aria-hidden="true">{product.emoji}</span>
      <div className="cart-line__info">
        <p className="cart-line__name">{product.name}</p>
        <p className="cart-line__unit">{formatPrice(product.priceInCents)} cada</p>
        <QuantityStepper
          name={product.name}
          quantity={quantity}
          max={product.stock}
          onIncrement={() => dispatch(addItem(product.id))}
          onDecrement={() => dispatch(decrementItem(product.id))}
        />
      </div>
      <div className="cart-line__right">
        <strong>{formatPrice(lineTotal)}</strong>
        <button type="button" className="link-button" onClick={() => dispatch(removeItem(product.id))}>
          Remover <span className="visually-hidden">{product.name}</span>
        </button>
      </div>
    </li>
  );
}
