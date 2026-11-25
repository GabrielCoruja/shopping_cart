import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../types';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name' | 'rating';

export interface FiltersState {
  search: string;
  category: Category | 'all';
  sort: SortOption;
}

const initialState: FiltersState = { search: '', category: 'all', sort: 'relevance' };

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<FiltersState['category']>) {
      state.category = action.payload;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setSearch, setCategory, setSort, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
