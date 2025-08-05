import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '../domains/auth/login/controller/authSlice'
import authApi from '../domains/auth/login/apis/authApi'
import { usersApi } from '@/domains/portal/users/apis'
import { jobsApi } from '@/domains/portal/jobs/apis/jobsApi'
import { contractsApi } from '@/domains/portal/contracts/apis/contractsApi'
import { applicationsApi } from '@/domains/portal/applications/apis/applicationsApi'
import { conversationsApi } from '@/domains/portal/conversations/apis/conversationsApi'
import { jobCategoriesApi } from '@/domains/portal/job-categories/apis/jobCategoriesApi'
import { dashboardApi } from '@/domains/portal/dashboard/apis/dashboardApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [contractsApi.reducerPath]: contractsApi.reducer,
    [applicationsApi.reducerPath]: applicationsApi.reducer,
    [conversationsApi.reducerPath]: conversationsApi.reducer,
    [jobCategoriesApi.reducerPath]: jobCategoriesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [authApi.util.resetApiState.type],
      },
    }).concat(authApi.middleware, usersApi.middleware, jobsApi.middleware, contractsApi.middleware, applicationsApi.middleware, conversationsApi.middleware, jobCategoriesApi.middleware, dashboardApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch