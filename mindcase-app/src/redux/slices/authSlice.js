import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Local fallback users (since DummyJSON cannot create new accounts)
// Added custom assignment user: Dulanjana / dullanjana224231
const LOCAL_USERS = [
  {
    id: 1001,
    username: 'dulanjana', // store normalized lowercase internally
    firstName: 'Dulanjana',
    lastName: '',
    email: 'dilshanrad22@mindcase.local',
    password: 'dullanjana224231',
    image: null,
  }
];

// Web-safe wrappers (SecureStore not supported on web) -------------------
const secureSetItem = async (key, value) => {
  if (Platform.OS === 'web') return; // skip silently on web
  try { await SecureStore.setItemAsync(key, value); } catch {}
};
const secureGetItem = async (key) => {
  if (Platform.OS === 'web') return null; // no persistence on web
  try { return await SecureStore.getItemAsync(key); } catch { return null; }
};
const secureDeleteItem = async (key) => {
  if (Platform.OS === 'web') return; 
  try { await SecureStore.deleteItemAsync(key); } catch {}
};

// Token generator (avoid Buffer use for web) -----------------------------
const genToken = () => 'local-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,10);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Async thunks for authentication
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const uname = (username || '').trim().toLowerCase();
      const pwd = (password || '').trim();

      // 1. Local user (case-insensitive)
      const localMatch = LOCAL_USERS.find(u => u.username === uname && u.password === pwd);
      if (localMatch) {
        const payload = {
          ...localMatch,
          token: genToken(),
          refreshToken: null,
          gender: null,
        };
        await secureSetItem(TOKEN_KEY, payload.token);
        await secureSetItem(USER_KEY, JSON.stringify(payload));
        return payload;
      }

      // 2. Fallback to DummyJSON demo users (only if not local)
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 30 })
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }
      await secureSetItem(TOKEN_KEY, data.token);
      await secureSetItem(USER_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password, firstName, lastName, email }, { rejectWithValue }) => {
    try {
      const uname = (username || '').trim().toLowerCase();
      const simulatedUser = {
        id: Date.now(),
        username: uname,
        firstName: firstName || username,
        lastName: lastName || '',
        email: email || `${uname}@mindcase.local`,
        token: genToken(),
      };
      await secureSetItem(TOKEN_KEY, simulatedUser.token);
      await secureSetItem(USER_KEY, JSON.stringify(simulatedUser));
      return simulatedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStored',
  async (_, { rejectWithValue }) => {
    try {
      const token = await secureGetItem(TOKEN_KEY);
      const userStr = await secureGetItem(USER_KEY);
      if (token && userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await secureDeleteItem(TOKEN_KEY);
    await secureDeleteItem(USER_KEY);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
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
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load stored auth
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.token = action.payload.token;
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
