import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export type SortOption = 'title' | 'year' | 'rating';
export type SortOrder = 'asc' | 'desc';

interface FilterState {
  searchQuery: string;
  selectedGenre: string | null;
  sortBy: SortOption;
  sortOrder: SortOrder;
  minRating: number;
}

const initialState: FilterState = {
  searchQuery: '',
  selectedGenre: null,
  sortBy: 'rating',
  sortOrder: 'desc',
  minRating: 0,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedGenre: (state, action: PayloadAction<string | null>) => {
      state.selectedGenre = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedGenre,
  setSortBy,
  toggleSortOrder,
  setMinRating,
  resetFilters,
} = filterSlice.actions;

export const selectSearchQuery = (state: RootState) => state.filter.searchQuery;
export const selectSelectedGenre = (state: RootState) => state.filter.selectedGenre;
export const selectSortBy = (state: RootState) => state.filter.sortBy;
export const selectSortOrder = (state: RootState) => state.filter.sortOrder;
export const selectMinRating = (state: RootState) => state.filter.minRating;
export const selectAllFilters = (state: RootState) => state.filter;

export default filterSlice.reducer;
