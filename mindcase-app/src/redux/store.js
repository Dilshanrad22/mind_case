import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import moodReducer from './slices/moodSlice';
import journalReducer from './slices/journalSlice';
import nutritionReducer from './slices/nutritionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    mood: moodReducer,
    journal: journalReducer,
    nutrition: nutritionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
