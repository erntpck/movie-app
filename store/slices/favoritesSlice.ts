import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface FavoritesState {
  movieIds: string[];
}

const initialState: FavoritesState = {
  movieIds: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.movieIds.includes(action.payload)) {
        state.movieIds.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.movieIds = state.movieIds.filter((id) => id !== action.payload);
    },
    clearFavorites: (state) => {
      state.movieIds = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;

export const selectFavoriteMovieIds = (state: RootState) => state.favorites.movieIds;
export const selectIsFavorite = (movieId: string) => (state: RootState) =>
  state.favorites.movieIds.includes(movieId);

export default favoritesSlice.reducer;
