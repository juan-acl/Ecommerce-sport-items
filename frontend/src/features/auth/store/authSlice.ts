import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@shared/types/common';

interface AuthState {
  user: User | null;
  token: string | null;
}

const TOKEN_KEY = 'sportcart_token';
const USER_KEY = 'sportcart_user';

function loadFromStorage(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    return {
      token: token || null,
      user: userJson ? JSON.parse(userJson) : null,
    };
  } catch {
    return { token: null, user: null };
  }
}

const initialState: AuthState = loadFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
