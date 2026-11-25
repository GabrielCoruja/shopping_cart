import { Link, useParams } from 'react-router';
import { useAppSelector } from '../store';
import { formatPrice } from '../utils/format';

export function OrderPage() {
  const { orderId } = useParams();
  const order = useAppSelector((state) => state.orders.history.find((o) => o.id === orderId));

  if (!order) {
    return (
      <div className="empty">
        <p className="empty__emoji" aria-hidden="true">📦</p>
        <h1>Pedido não encontrado</h1>
        <p>Os pedidos ficam guardados só enquanto a página está aberta.</p>
        <Link to="/" className="button">Voltar para a loja</Link>
      </div>
    );
  }

  const firstName = order.customer.name.trim().split(' ')[0];

  return (
    <section className="panel order" aria-labelledby="order-title">
      <p className="order__emoji" aria-hidden="true">🎉</p>
      <h1 id="order-title">Pedido confirmado!</h1>
      <p>
        Obrigado, {firstName}! Seu pedido <strong>{order.id}</strong> foi registrado e a confirmação
        seria enviada para <strong>{order.customer.email}</strong>.
      </p>
      <ul className="summary-lines">
        {order.items.map((item) => (
          <li key={item.productId}>
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.quantity}× {item.name}</span>
            <strong>{formatPrice(item.priceInCents * item.quantity)}</strong>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <div><dt>Subtotal</dt><dd>{formatPrice(order.totals.subtotal)}</dd></div>
        {order.totals.discount > 0 && (
          <div className="totals__discount"><dt>Desconto{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>− {formatPrice(order.totals.discount)}</dd></div>
        )}
        <div><dt>Frete</dt><dd>{order.totals.shipping === 0 ? 'Grátis' : formatPrice(order.totals.shipping)}</dd></div>
        <div className="totals__total"><dt>Total</dt><dd>{formatPrice(order.totals.total)}</dd></div>
      </dl>
      <p className="order__address">Entrega em {order.customer.address}, {order.customer.city} · CEP {order.customer.cep}</p>
      <Link to="/" className="button">Continuar comprando</Link>
    </section>
  );
}
