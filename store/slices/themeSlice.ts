import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  accentColor: string;
}

const initialState: ThemeState = {
  mode: 'dark',
  accentColor: '#e50914',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode, setAccentColor } = themeSlice.actions;

export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectAccentColor = (state: RootState) => state.theme.accentColor;

export default themeSlice.reducer;
