import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

// --- Define User and Auth State ---
interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
}

// --- Initial State ---
const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
};

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state: AuthState) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

// --- Export Actions ---
export const { login, logout } = authSlice.actions;

// --- Selectors ---
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;
export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;

// --- useAppDispatch Helper ---
export const useAppDispatch = () => {
  try {
    return useDispatch();
  } catch {
    // Fallback in build/static context
    return (() => {}) as any;
  }
};

// --- Export Reducer ---
export default authSlice.reducer;
