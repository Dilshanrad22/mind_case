import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@mindease_favorites';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loaded: false,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload;
      state.loaded = true;
    },
    toggleFavorite: (state, action) => {
      const exercise = action.payload;
      const exists = state.items.find(item => 
        (item.name || item.title) === (exercise.name || exercise.title)
      );
      
      if (exists) {
        state.items = state.items.filter(item => 
          (item.name || item.title) !== (exercise.name || exercise.title)
        );
      } else {
        state.items.push(exercise);
      }
      
      // Persist to AsyncStorage
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(state.items));
    },
    loadFavorites: (state, action) => {
      state.items = action.payload || [];
      state.loaded = true;
    },
  },
});

export const { setFavorites, toggleFavorite, loadFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// Helper function to load favorites from storage
export const loadFavoritesFromStorage = () => async (dispatch) => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    if (stored) {
      dispatch(loadFavorites(JSON.parse(stored)));
    } else {
      dispatch(loadFavorites([]));
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
    dispatch(loadFavorites([]));
  }
};
