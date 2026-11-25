import { CATEGORIES } from '../data/products';
import { useAppDispatch, useAppSelector } from '../store';
import { setCategory, setSearch, setSort, type SortOption } from '../store/filtersSlice';
import { selectFilters } from '../store/selectors';
import type { Category } from '../types';

const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Relevância',
  'price-asc': 'Menor preço',
  'price-desc': 'Maior preço',
  name: 'Nome (A–Z)',
  rating: 'Melhor avaliação',
};

export function Filters() {
  const dispatch = useAppDispatch();
  const { search, category, sort } = useAppSelector(selectFilters);
  const categories = Object.entries(CATEGORIES) as Array<[Category, string]>;

  return (
    <section className="filters" aria-label="Filtros">
      <div className="filters__row">
        <label className="field field--grow">
          <span className="visually-hidden">Buscar produtos</span>
          <input
            type="search"
            placeholder="Buscar produtos…"
            value={search}
            onChange={(event) => dispatch(setSearch(event.target.value))}
          />
        </label>
        <label className="field">
          <span className="field__label">Ordenar por</span>
          <select value={sort} onChange={(event) => dispatch(setSort(event.target.value as SortOption))}>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="chips" role="group" aria-label="Categorias">
        <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => dispatch(setCategory('all'))}>
          Todos
        </button>
        {categories.map(([value, label]) => (
          <button key={value} type="button" className="chip" aria-pressed={category === value} onClick={() => dispatch(setCategory(value))}>
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
