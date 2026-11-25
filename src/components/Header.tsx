import { Link } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store';
import { selectCartCount } from '../store/selectors';
import { openCart } from '../store/uiSlice';

export function Header() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCartCount);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand" aria-label="Loja Coruja, página inicial">
          <span aria-hidden="true">🦉</span> Loja Coruja
        </Link>
        <button
          type="button"
          className="cart-button"
          onClick={() => dispatch(openCart())}
          aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}
        >
          <span aria-hidden="true">🛒</span>
          <span className="cart-button__label">Carrinho</span>
          <span className="badge" aria-live="polite" data-testid="cart-count">{count}</span>
        </button>
      </div>
    </header>
  );
}
