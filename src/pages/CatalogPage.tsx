import { Filters } from '../components/Filters';
import { ProductCard } from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../store';
import { resetFilters } from '../store/filtersSlice';
import { selectVisibleProducts } from '../store/selectors';

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectVisibleProducts);

  return (
    <>
      <section className="hero">
        <h1>Produtos escolhidos a dedo</h1>
        <p>Frete grátis a partir de R$ 199 e cupons de desconto no carrinho.</p>
      </section>
      <Filters />
      <p className="results" aria-live="polite">
        {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
      </p>
      {products.length === 0 ? (
        <div className="empty">
          <p className="empty__emoji" aria-hidden="true">🔍</p>
          <p>Nenhum produto encontrado com esses filtros.</p>
          <button type="button" className="button" onClick={() => dispatch(resetFilters())}>Limpar filtros</button>
        </div>
      ) : (
        <div className="grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </>
  );
}
