import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addFood as addFoodApi,
  getTodayNutrition as getTodayNutritionApi,
  updateSteps as updateStepsApi,
  getWeeklyNutrition as getWeeklyNutritionApi,
  deleteFood as deleteFoodApi,
  getTodayFoods as getTodayFoodsApi,
} from '../../services/nutritionApi';

// Async thunks
export const addFood = createAsyncThunk(
  'nutrition/addFood',
  async (foodData, { rejectWithValue }) => {
    try {
      const response = await addFoodApi(foodData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodayNutrition = createAsyncThunk(
  'nutrition/fetchTodayNutrition',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTodayNutritionApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSteps = createAsyncThunk(
  'nutrition/updateSteps',
  async ({ steps, addToExisting = true }, { rejectWithValue }) => {
    try {
      const response = await updateStepsApi(steps, addToExisting);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeeklyNutrition = createAsyncThunk(
  'nutrition/fetchWeeklyNutrition',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWeeklyNutritionApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFood = createAsyncThunk(
  'nutrition/deleteFood',
  async (foodId, { rejectWithValue }) => {
    try {
      const response = await deleteFoodApi(foodId);
      return { foodId, dailyNutrition: response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodayFoods = createAsyncThunk(
  'nutrition/fetchTodayFoods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTodayFoodsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState: {
    todayNutrition: null,
    todayFoods: [],
    weeklyData: [],
    weeklyTotals: null,
    weeklyAverages: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearNutritionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Food
      .addCase(addFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFood.fulfilled, (state, action) => {
        state.loading = false;
        state.todayNutrition = action.payload.dailyNutrition;
        state.todayFoods.push(action.payload.food);
      })
      .addCase(addFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Today Nutrition
      .addCase(fetchTodayNutrition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayNutrition.fulfilled, (state, action) => {
        state.loading = false;
        state.todayNutrition = action.payload;
      })
      .addCase(fetchTodayNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Steps
      .addCase(updateSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.todayNutrition = action.payload;
      })
      .addCase(updateSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Weekly Nutrition
      .addCase(fetchWeeklyNutrition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyNutrition.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyData = action.payload.weeklyData;
        state.weeklyTotals = action.payload.totals;
        state.weeklyAverages = action.payload.averages;
      })
      .addCase(fetchWeeklyNutrition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Food
      .addCase(deleteFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.loading = false;
        state.todayFoods = state.todayFoods.filter(
          (food) => food._id !== action.payload.foodId
        );
        state.todayNutrition = action.payload.dailyNutrition;
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Today Foods
      .addCase(fetchTodayFoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.todayFoods = action.payload;
      })
      .addCase(fetchTodayFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearNutritionError } = nutritionSlice.actions;

export default nutritionSlice.reducer;
