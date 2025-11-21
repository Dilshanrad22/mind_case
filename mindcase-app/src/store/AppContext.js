import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [moodEntries, setMoodEntries] = useState([]); // { id, value(1-5), note, date }
  const [journalEntries, setJournalEntries] = useState([]); // { id, title, body, date }

  const exercises = [
    { id: 'breath-box', title: 'Box Breathing', description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s.' },
    { id: 'mindful-min', title: '1-Minute Mindfulness', description: 'Observe surroundings & breathing for one minute.' },
    { id: 'body-scan', title: 'Body Scan', description: 'Mentally scan each part of your body and relax.' }
  ];

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

  const value = { moodEntries, addMood, journalEntries, addJournal, exercises, recentMoodAverage };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
