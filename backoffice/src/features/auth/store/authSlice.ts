import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, ModulePermission } from '@shared/types/common';

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: ModulePermission[];
}

const TOKEN_KEY = 'backoffice_token';
const USER_KEY = 'backoffice_user';
const PERMISSIONS_KEY = 'backoffice_permissions';

function loadFromStorage(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    const permJson = localStorage.getItem(PERMISSIONS_KEY);
    return {
      token: token || null,
      user: userJson ? (JSON.parse(userJson) as User) : null,
      permissions: permJson ? (JSON.parse(permJson) as ModulePermission[]) : [],
    };
  } catch {
    return { token: null, user: null, permissions: [] };
  }
}

const initialState: AuthState = loadFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; permissions: ModulePermission[] }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.permissions = action.payload.permissions;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(action.payload.permissions));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.permissions = [];
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PERMISSIONS_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectPermissions = (state: { auth: AuthState }) => state.auth.permissions;

export const selectHasBackofficeAccess = (state: { auth: AuthState }) =>
  !!state.auth.token && state.auth.user?.role !== 'client';

export const selectCanAccess =
  (module: string, action: string) =>
  (state: { auth: AuthState }): boolean =>
    state.auth.permissions.some(
      (p) => p.module === module && p.actions.includes(action),
    );
