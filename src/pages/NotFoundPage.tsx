import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="empty">
      <p className="empty__emoji" aria-hidden="true">🦉</p>
      <h1>Página não encontrada</h1>
      <Link to="/" className="button">Voltar para a loja</Link>
    </div>
  );
}
