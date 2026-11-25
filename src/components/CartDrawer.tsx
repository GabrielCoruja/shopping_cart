import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/cartSlice';
import { selectDetailedCart } from '../store/selectors';
import { closeCart } from '../store/uiSlice';
import { CartLine } from './CartLine';
import { CouponForm, FreeShippingProgress, TotalsTable } from './CartSummary';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const open = useAppSelector((state) => state.ui.cartOpen);
  const lines = useAppSelector(selectDetailedCart);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dispatch(closeCart());
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('no-scroll');
    };
  }, [open, dispatch]);

  if (!open) return null;

  const goToCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  return (
    <div className="drawer-backdrop" onClick={() => dispatch(closeCart())}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer__header">
          <h2 id="drawer-title">Seu carrinho</h2>
          <button ref={closeButton} type="button" className="icon-button" onClick={() => dispatch(closeCart())} aria-label="Fechar carrinho">✕</button>
        </div>

        {lines.length === 0 ? (
          <div className="empty">
            <p className="empty__emoji" aria-hidden="true">🛒</p>
            <p>Seu carrinho está vazio.</p>
            <button type="button" className="button" onClick={() => dispatch(closeCart())}>Ver produtos</button>
          </div>
        ) : (
          <>
            <FreeShippingProgress />
            <ul className="cart-lines">
              {lines.map((line) => (
                <CartLine key={line.productId} product={line.product} quantity={line.quantity} lineTotal={line.lineTotal} />
              ))}
            </ul>
            <div className="drawer__footer">
              <CouponForm />
              <TotalsTable />
              <button type="button" className="button button--block" onClick={goToCheckout}>Finalizar compra</button>
              <button type="button" className="link-button link-button--center" onClick={() => dispatch(clearCart())}>Esvaziar carrinho</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
