import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const FAVORITES_STORAGE_KEY = '@mindease_favorites';

export function AppProvider({ children }) {
  const [moodEntries, setMoodEntries] = useState([]); // { id, value(1-5), note, date }
  const [journalEntries, setJournalEntries] = useState([]); // { id, title, body, date }
  const [favoriteExercises, setFavoriteExercises] = useState([]); // Array of exercise objects

  const exercises = [
    { id: 'breath-box', title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.' },
    { id: 'mindful-min', title: '1-Minute Mindfulness', description: 'Observe surroundings & breathing for one minute.' },
    { id: 'body-scan', title: 'Body Scan', description: 'Mentally scan each part of your body and relax.' }
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
