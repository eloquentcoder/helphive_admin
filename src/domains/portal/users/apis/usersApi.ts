import { API_URL } from '@/config/url'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'helper' | 'seeker' | 'admin'
  status: 'active' | 'pending' | 'suspended' | 'banned'
  verified: boolean
  phone?: string
  address?: string
  location?: string // Added for backward compatibility
  registrationDate: string
  lastActive?: string
  totalJobs: number
  completedJobs: number
  rating: number
  earnings: number
  profileCompleteness: number
  skills?: string[] // Added skills array
  documents?: {
    id: string
    type: 'id' | 'license' | 'certificate'
    status: 'pending' | 'approved' | 'rejected'
    uploadDate: string
  }[]
  preferences?: {
    notifications: boolean
    emailMarketing: boolean
    darkMode: boolean
  }
  stats?: {
    totalEarnings: number
    totalSpent: number
    reviewsReceived: number
    reviewsGiven: number
    responseTime?: number
    completionRate?: number
  }
}

export interface UsersFilter {
  search?: string
  role?: string[]
  status?: string[]
  verified?: boolean
  registrationDateFrom?: string
  registrationDateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface UsersResponse {
  users: User[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserAnalytics {
  totalUsers: number
  activeUsers: number
  pendingVerifications: number
  bannedUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  usersByRole: {
    role: string
    count: number
    percentage: number
  }[]
  usersByStatus: {
    status: string
    count: number
    percentage: number
  }[]
}

export interface BulkAction {
  userIds: string[]
  action: 'approve' | 'suspend' | 'ban' | 'delete' | 'verify' | 'unverify'
  reason?: string
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + '/user',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token from state if available
      const token = (getState() as any).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['User', 'UserAnalytics'],
  endpoints: (builder) => ({
    // Get users with filtering and pagination
    getUsers: builder.query<UsersResponse, UsersFilter>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['User'],
    }),

    // Get single user details
    getUser: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),

    // Get user analytics
    getUserAnalytics: builder.query<UserAnalytics, void>({
      query: () => '/analytics',
      providesTags: ['UserAnalytics'],
    }),

    // Update user status
    updateUserStatus: builder.mutation<User, { id: string; status: User['status']; reason?: string }>({
      query: ({ id, status, reason }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status, reason },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'User', id },
        'User',
        'UserAnalytics',
      ],
    }),

    // Update user verification status
    updateUserVerification: builder.mutation<User, { id: string; verified: boolean }>({
      query: ({ id, verified }) => ({
        url: `/${id}/verification`,
        method: 'PATCH',
        body: { verified },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'User', id },
        'User',
        'UserAnalytics',
      ],
    }),

    // Create new user
    createUser: builder.mutation<User, Partial<User> & { password: string }>({
      query: (userData) => ({
        url: '',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User', 'UserAnalytics'],
    }),

    // Update user
    updateUser: builder.mutation<User, { id: string } & Partial<User>>({
      query: ({ id, ...userData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'User', id },
        'User',
        'UserAnalytics',
      ],
    }),

    // Update user role
    updateUserRole: builder.mutation<User, { id: string; role: User['role'] }>({
      query: ({ id, role }) => ({
        url: `/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'User', id },
        'User',
        'UserAnalytics',
      ],
    }),

    // Bulk actions
    bulkUpdateUsers: builder.mutation<{ success: boolean; affected: number }, BulkAction>({
      query: (bulkAction) => ({
        url: '/bulk',
        method: 'PATCH',
        body: bulkAction,
      }),
      invalidatesTags: ['User', 'UserAnalytics'],
    }),

    // Delete user
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'UserAnalytics'],
    }),

    // Export users
    exportUsers: builder.mutation<{ downloadUrl: string }, UsersFilter>({
      query: (filters) => ({
        url: '/export',
        method: 'POST',
        body: filters,
      }),
    }),

    // Get user activity timeline
    getUserActivity: builder.query<
      {
        activities: {
          id: string
          type: string
          description: string
          timestamp: string
          metadata?: any
        }[]
      },
      { userId: string; page?: number; limit?: number }
    >({
      query: ({ userId, page = 1, limit = 20 }) => ({
        url: `/${userId}/activity`,
        params: { page, limit },
      }),
    }),
    // Approve document verification
    approveDocument: builder.mutation<
      { success: boolean },
      { userId: string; documentId: string; approved: boolean; reason?: string }
    >({
      query: ({ userId, documentId, approved, reason }) => ({
        url: `/${userId}/documents/${documentId}/approve`,
        method: 'PATCH',
        body: { approved, reason },
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'User', id: userId }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserAnalyticsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserVerificationMutation,
  useUpdateUserRoleMutation,
  useBulkUpdateUsersMutation,
  useDeleteUserMutation,
  useExportUsersMutation,
  useGetUserActivityQuery,
  useApproveDocumentMutation,
} = usersApi