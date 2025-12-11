import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as journalApi from '../../services/journalApi';

// Async thunks for journal operations
export const fetchJournals = createAsyncThunk(
  'journal/fetchJournals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await journalApi.getJournals();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJournal = createAsyncThunk(
  'journal/createJournal',
  async ({ title, text }, { rejectWithValue }) => {
    try {
      const journal = await journalApi.createJournal(title, text);
      return journal;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJournal = createAsyncThunk(
  'journal/updateJournal',
  async ({ id, title, text }, { rejectWithValue }) => {
    try {
      const journal = await journalApi.updateJournal(id, title, text);
      return journal;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJournal = createAsyncThunk(
  'journal/deleteJournal',
  async (id, { rejectWithValue }) => {
    try {
      await journalApi.deleteJournal(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch journals
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create journal
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update journal
      .addCase(updateJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete journal
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(e => e._id !== action.payload);
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = journalSlice.actions;
export default journalSlice.reducer;
