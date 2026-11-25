import { useState, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { applyCoupon, removeCoupon } from '../store/cartSlice';
import { selectCoupon, selectCouponPending, selectTotals } from '../store/selectors';
import { formatPrice } from '../utils/format';
import { findCoupon, FREE_SHIPPING_FROM } from '../utils/pricing';

export function FreeShippingProgress() {
  const { subtotal, shipping } = useAppSelector(selectTotals);
  if (subtotal === 0) return null;

  const missing = FREE_SHIPPING_FROM - subtotal;
  const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));

  return (
    <div className="shipping-progress">
      <p>
        {shipping === 0
          ? '🎉 Você ganhou frete grátis!'
          : <>Faltam <strong>{formatPrice(missing)}</strong> para o frete grátis</>}
      </p>
      <div className="progress" role="progressbar" aria-label="Progresso para frete grátis" aria-valuemin={0} aria-valuemax={100} aria-valuenow={shipping === 0 ? 100 : percent}>
        <span style={{ width: `${shipping === 0 ? 100 : percent}%` }} />
      </div>
    </div>
  );
}

export function CouponForm() {
  const dispatch = useAppDispatch();
  const coupon = useAppSelector(selectCoupon);
  const pending = useAppSelector(selectCouponPending);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!findCoupon(code)) {
      setError('Cupom inválido');
      return;
    }
    dispatch(applyCoupon(code));
    setCode('');
    setError('');
  };

  if (coupon) {
    return (
      <div className="coupon coupon--applied">
        <p>
          <strong>{coupon.code}</strong>: {coupon.description}
          {pending && <span className="coupon__warning"> (ainda não atingiu o valor mínimo)</span>}
        </p>
        <button type="button" className="link-button" onClick={() => dispatch(removeCoupon())}>Remover cupom</button>
      </div>
    );
  }

  return (
    <form className="coupon" onSubmit={handleSubmit} noValidate>
      <label className="field field--grow">
        <span className="visually-hidden">Cupom de desconto</span>
        <input
          placeholder="Cupom de desconto"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'coupon-error' : 'coupon-hint'}
        />
      </label>
      <button type="submit" className="button button--secondary">Aplicar</button>
      {error
        ? <p id="coupon-error" className="field__error" role="alert">{error}</p>
        : <p id="coupon-hint" className="field__hint">Experimente CORUJA10, BEMVINDO20 ou FRETEGRATIS</p>}
    </form>
  );
}

export function TotalsTable() {
  const { subtotal, discount, shipping, total } = useAppSelector(selectTotals);

  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
      {discount > 0 && <div className="totals__discount"><dt>Desconto</dt><dd>− {formatPrice(discount)}</dd></div>}
      <div><dt>Frete</dt><dd>{shipping === 0 ? 'Grátis' : formatPrice(shipping)}</dd></div>
      <div className="totals__total"><dt>Total</dt><dd data-testid="cart-total">{formatPrice(total)}</dd></div>
    </dl>
  );
}
