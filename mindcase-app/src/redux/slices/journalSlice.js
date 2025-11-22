import { createSlice } from '@reduxjs/toolkit';

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    entries: [], // { id, title, body, date }
  },
  reducers: {
    addJournalEntry: (state, action) => {
      const entry = {
        id: Date.now().toString(),
        title: action.payload.title,
        body: action.payload.body,
        date: new Date().toISOString(),
      };
      state.entries.push(entry);
    },
    deleteJournalEntry: (state, action) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
    updateJournalEntry: (state, action) => {
      const index = state.entries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = { ...state.entries[index], ...action.payload };
      }
    },
  },
});

export const { addJournalEntry, deleteJournalEntry, updateJournalEntry } = journalSlice.actions;
export default journalSlice.reducer;
