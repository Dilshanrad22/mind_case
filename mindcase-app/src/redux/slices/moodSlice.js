import { createSlice } from '@reduxjs/toolkit';

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    entries: [], // { id, value(1-5), note, date }
  },
  reducers: {
    addMoodEntry: (state, action) => {
      const entry = {
        id: Date.now().toString(),
        value: action.payload.value,
        note: action.payload.note,
        date: new Date().toISOString(),
      };
      state.entries.push(entry);
    },
    deleteMoodEntry: (state, action) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
  },
});

export const { addMoodEntry, deleteMoodEntry } = moodSlice.actions;
export default moodSlice.reducer;

// Selector for recent mood average
export const selectRecentMoodAverage = (state) => {
  const entries = state.mood.entries;
  if (!entries.length) return null;
  
  const lastWeek = entries.filter(m => 
    Date.now() - new Date(m.date).getTime() < 7 * 24 * 60 * 60 * 1000
  );
  
  if (!lastWeek.length) return null;
  return (lastWeek.reduce((sum, m) => sum + m.value, 0) / lastWeek.length).toFixed(1);
};
