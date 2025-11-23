import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const FAVORITES_STORAGE_KEY = '@mindease_favorites';

export function AppProvider({ children }) {
  const [moodEntries, setMoodEntries] = useState([]); // { id, value(1-5), note, date }
  const [journalEntries, setJournalEntries] = useState([]); // { id, title, body, date }
  const [favoriteExercises, setFavoriteExercises] = useState([]); // Array of exercise objects

  const exercises = [
    { id: 'breath-box', title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.', image: 'https://images.unsplash.com/photo-1523978591478-c753949ff840?auto=format&w=400&q=60' },
    { id: 'mindful-min', title: '1-Minute Mindfulness', description: 'Observe surroundings & breathing for one minute.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&w=400&q=60' },
    { id: 'body-scan', title: 'Body Scan', description: 'Mentally scan each part of your body and relax.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&w=400&q=60' },
    { id: 'gratitude-journal', title: 'Gratitude Journal', description: 'Write three things you are thankful for.', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&w=400&q=60' },
    { id: 'progressive-muscle', title: 'Progressive Muscle Relaxation', description: 'Tense and release muscle groups head to toe.', image: 'https://images.unsplash.com/photo-1584467735871-1f9d29f92f31?auto=format&w=400&q=60' },
    { id: 'guided-meditation', title: 'Guided Meditation', description: 'Follow a 5–10 minute audio or video guide.', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&w=400&q=60' },
    { id: 'walking-mindful', title: 'Mindful Walking', description: 'Slow walk focusing on sensations in each step.', image: 'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&w=400&q=60' },
    { id: 'breath-478', title: '4-7-8 Breathing', description: 'Inhale 4s, hold 7s, exhale 8s to calm nervous system.', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&w=400&q=60' }
  ];

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    if (favoriteExercises.length >= 0) {
      saveFavorites();
    }
  }, [favoriteExercises]);

  async function loadFavorites() {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteExercises(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  async function saveFavorites() {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteExercises));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  function toggleFavorite(exercise) {
    setFavoriteExercises(prev => {
      const exists = prev.find(ex => ex.name === exercise.name);
      if (exists) {
        // Remove from favorites
        return prev.filter(ex => ex.name !== exercise.name);
      } else {
        // Add to favorites
        return [...prev, exercise];
      }
    });
  }

  function isFavorite(exercise) {
    return favoriteExercises.some(ex => ex.name === exercise.name);
  }

  function addMood(value, note) {
    setMoodEntries(prev => [...prev, { id: Date.now().toString(), value, note, date: new Date().toISOString() }]);
  }

  function addJournal(title, body) {
    setJournalEntries(prev => [...prev, { id: Date.now().toString(), title, body, date: new Date().toISOString() }]);
  }

  const recentMoodAverage = useMemo(() => {
    if (!moodEntries.length) return null;
    const lastWeek = moodEntries.filter(m => Date.now() - new Date(m.date).getTime() < 7 * 24 * 60 * 60 * 1000);
    if (!lastWeek.length) return null;
    return (lastWeek.reduce((sum, m) => sum + m.value, 0) / lastWeek.length).toFixed(1);
  }, [moodEntries]);

  const value = { 
    moodEntries, 
    addMood, 
    journalEntries, 
    addJournal, 
    exercises, 
    recentMoodAverage,
    favoriteExercises,
    toggleFavorite,
    isFavorite
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
