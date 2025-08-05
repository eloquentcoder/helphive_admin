import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../apis/authApi'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('admin_token'),
  isAuthenticated: false,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('admin_token', token)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('admin_token')
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem('admin_token', action.payload)
    },
  },
})

export const { setCredentials, logout, setUser, setLoading, updateToken } = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading

// Helper functions
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.roles?.includes(role) ?? false
}

export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  return roles.some(role => hasRole(user, role))
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  return user?.permissions?.includes(permission) ?? false
}

export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission))
}