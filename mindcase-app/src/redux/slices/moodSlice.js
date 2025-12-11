import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as moodApi from '../../services/moodApi';

// Async thunks for mood operations
export const fetchMoods = createAsyncThunk(
  'mood/fetchMoods',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await moodApi.getMoods(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMood = createAsyncThunk(
  'mood/createMood',
  async (moodType, { rejectWithValue }) => {
    try {
      const mood = await moodApi.createMood(moodType);
      return mood;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMood = createAsyncThunk(
  'mood/updateMood',
  async ({ id, moodType }, { rejectWithValue }) => {
    try {
      const mood = await moodApi.updateMood(id, moodType);
      return mood;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMood = createAsyncThunk(
  'mood/deleteMood',
  async (id, { rejectWithValue }) => {
    try {
      await moodApi.deleteMood(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoodStats = createAsyncThunk(
  'mood/fetchMoodStats',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const stats = await moodApi.getMoodStats(startDate, endDate);
      return stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    entries: [],
    stats: [],
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
      // Fetch moods
      .addCase(fetchMoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchMoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create mood
      .addCase(createMood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMood.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.unshift(action.payload);
      })
      .addCase(createMood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update mood
      .addCase(updateMood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMood.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      })
      .addCase(updateMood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete mood
      .addCase(deleteMood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMood.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(e => e._id !== action.payload);
      })
      .addCase(deleteMood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch mood stats
      .addCase(fetchMoodStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchMoodStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = moodSlice.actions;
export default moodSlice.reducer;

// Selectors
export const selectRecentMoodAverage = (state) => {
  const entries = state.mood.entries;
  if (!entries.length) return null;
  
  // Get last 7 days of moods
  const lastWeek = entries.filter(m => {
    const moodDate = new Date(m.createdAt);
    const daysDiff = (Date.now() - moodDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  });
  
  if (!lastWeek.length) return null;
  
  // Map mood types to numeric values for average
  const moodValues = {
    happy: 5,
    excited: 5,
    motivated: 4,
    calm: 4,
    neutral: 3,
    tired: 2,
    anxious: 2,
    stressed: 2,
    sad: 1,
    angry: 1,
  };
  
  const sum = lastWeek.reduce((acc, m) => acc + (moodValues[m.moodType] || 3), 0);
  return (sum / lastWeek.length).toFixed(1);
};
