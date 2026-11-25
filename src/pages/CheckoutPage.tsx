import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { CouponForm, TotalsTable } from '../components/CartSummary';
import { useAppDispatch, useAppSelector } from '../store';
import { placeOrder } from '../store/ordersSlice';
import { selectCouponCode, selectDetailedCart, selectTotals } from '../store/selectors';
import type { Customer, PaymentMethod } from '../types';
import { formatPrice } from '../utils/format';
import { formatCep, validateCustomer, type CheckoutErrors } from './checkoutValidation';

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto',
};

const EMPTY_CUSTOMER: Customer = { name: '', email: '', cep: '', address: '', city: '', payment: 'pix' };

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const lines = useAppSelector(selectDetailedCart);
  const totals = useAppSelector(selectTotals);
  const couponCode = useAppSelector(selectCouponCode);
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  if (lines.length === 0) {
    return (
      <div className="empty">
        <p className="empty__emoji" aria-hidden="true">🛒</p>
        <h1>Seu carrinho está vazio</h1>
        <Link to="/" className="button">Voltar para a loja</Link>
      </div>
    );
  }

  const update = (field: keyof Customer) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = field === 'cep' ? formatCep(event.target.value) : event.target.value;
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validateCustomer(customer);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const id = `LC-${Date.now().toString(36).toUpperCase()}`;
    dispatch(placeOrder({
      id,
      createdAt: new Date().toISOString(),
      customer,
      couponCode,
      totals,
      items: lines.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
        name: product.name,
        priceInCents: product.priceInCents,
        emoji: product.emoji,
      })),
    }));
    navigate(`/pedido/${id}`);
  };

  const field = (name: keyof Customer, label: string, props: Record<string, string> = {}) => (
    <div className="field">
      <label className="field__label" htmlFor={`checkout-${name}`}>{label}</label>
      <input
        id={`checkout-${name}`}
        name={name}
        value={customer[name]}
        onChange={update(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && <span id={`${name}-error`} className="field__error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout">
      <form ref={formRef} className="panel" onSubmit={handleSubmit} noValidate aria-labelledby="checkout-title">
        <h1 id="checkout-title">Finalizar compra</h1>
        <fieldset>
          <legend>Seus dados</legend>
          {field('name', 'Nome completo', { autoComplete: 'name' })}
          {field('email', 'E-mail', { type: 'email', autoComplete: 'email' })}
        </fieldset>
        <fieldset>
          <legend>Entrega</legend>
          <div className="form-row">
            {field('cep', 'CEP', { inputMode: 'numeric', autoComplete: 'postal-code', placeholder: '00000-000' })}
            {field('city', 'Cidade', { autoComplete: 'address-level2' })}
          </div>
          {field('address', 'Endereço (rua e número)', { autoComplete: 'street-address' })}
        </fieldset>
        <fieldset>
          <legend>Pagamento</legend>
          <div className="payment-options">
            {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
              <label key={method} className="radio">
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={customer.payment === method}
                  onChange={() => setCustomer((current) => ({ ...current, payment: method }))}
                />
                {PAYMENT_LABELS[method]}
              </label>
            ))}
          </div>
          <p className="field__hint">Demonstração: nenhum dado de pagamento é pedido nem processado.</p>
        </fieldset>
        <button type="submit" className="button button--block">Confirmar pedido · {formatPrice(totals.total)}</button>
      </form>

      <aside className="panel" aria-labelledby="summary-title">
        <h2 id="summary-title">Resumo</h2>
        <ul className="summary-lines">
          {lines.map(({ product, quantity, lineTotal }) => (
            <li key={product.id}>
              <span aria-hidden="true">{product.emoji}</span>
              <span>{quantity}× {product.name}</span>
              <strong>{formatPrice(lineTotal)}</strong>
            </li>
          ))}
        </ul>
        <CouponForm />
        <TotalsTable />
      </aside>
    </div>
  );
}
