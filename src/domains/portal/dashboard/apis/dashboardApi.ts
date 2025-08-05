import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/config/url'

export interface DashboardStats {
  totalUsers: {
    value: string
    change: number
    trend: 'up' | 'down'
  }
  activeJobs: {
    value: string
    change: number
    trend: 'up' | 'down'
  }
  revenue: {
    value: string
    change: number
    trend: 'up' | 'down'
  }
  activeContracts: {
    value: string
    change: number
    trend: 'up' | 'down'
  }
}

export interface ActivityItem {
  id: string
  type: 'user' | 'job' | 'contract' | 'payment' | 'alert'
  title: string
  description: string
  time: string
  status?: 'success' | 'warning' | 'error' | 'info'
}

export interface ChartDataPoint {
  date: string
  revenue: number
  jobs: number
  users: number
}

export interface TopHelper {
  id: number
  name: string
  avatar?: string
  completedJobs: number
  rating: number
  earnings: number
}

export interface TopServiceProvider {
  id: number
  name: string
  avatar?: string
  postedJobs: number
  completedJobs: number
  totalSpent: number
}

export interface TopService {
  id: number
  name: string
  count: number
  revenue: number
}

export interface TopCategory {
  id: number
  name: string
  count: number
  icon?: string
  color?: string
}

export interface Transaction {
  id: number
  user: {
    id: number
    name: string
    avatar?: string
  }
  type: string
  amount: number
  status: string
  description: string
  createdAt: string
  time: string
}

export interface PerformanceData {
  chart: Array<{
    date: string
    responseTime: number
    uptime: number
    errorRate: number
  }>
  summary: {
    avgResponseTime: number
    avgUptime: number
    avgErrorRate: number
  }
}

export interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
  chartData: ChartDataPoint[]
  topHelpers: TopHelper[]
  topServiceProviders: TopServiceProvider[]
  topServices: TopService[]
  topCategories: TopCategory[]
  recentTransactions: Transaction[]
  performanceData: PerformanceData
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('accept', 'application/json')
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Dashboard', 'Stats'],
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),
  }),
})

export const { useGetDashboardQuery, useGetDashboardStatsQuery } = dashboardApi