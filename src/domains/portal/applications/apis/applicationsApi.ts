import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/config/url'

// Application Interfaces
export interface Application {
  id: string
  jobId: string
  jobTitle: string
  applicationId: string
  helperId: string
  helperName: string
  helperEmail: string
  helperAvatar?: string
  helperPhone?: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'withdrawn'
  appliedAt: string
  reviewedAt?: string
  coverLetter?: string
  customAnswers?: Record<string, any>
  isPerfectMatch: boolean
  matchScore?: number
  employerId: string
  employerName: string
  employerEmail: string
  salaryRange: string
  workType: string
  category: string
  location: string
  isUrgent: boolean
  averageRating?: number
  totalReviews?: number
  completedJobs?: number
  responseTime?: string
  lastActiveAt?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  statusBadgeColor: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationFilters {
  search?: string
  status?: string[]
  jobId?: string
  helperId?: string
  employerId?: string
  isPerfectMatch?: boolean
  verificationStatus?: string[]
  category?: string[]
  workType?: string[]
  appliedDateFrom?: string
  appliedDateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ApplicationListResponse {
  applications: Application[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApplicationAnalytics {
  totalApplications: number
  pendingApplications: number
  acceptedApplications: number
  rejectedApplications: number
  withdrawnApplications: number
  averageResponseTime: number
  newApplicationsToday: number
  newApplicationsThisWeek: number
  newApplicationsThisMonth: number
  applicationsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  applicationsByCategory: Array<{
    category: string
    count: number
    percentage: number
  }>
  topPerformingHelpers: Array<{
    id: string
    name: string
    email: string
    applicationsCount: number
    acceptanceRate: number
    averageRating: number
  }>
  applicationTrends: Array<{
    date: string
    count: number
  }>
}

export interface BulkApplicationAction {
  applicationIds: string[]
  action: 'accept' | 'reject' | 'mark_reviewed' | 'delete'
  reason?: string
}

export interface ApplicationStatusUpdate {
  status: Application['status']
  reason?: string
  notes?: string
}

export const applicationsApi = createApi({
  reducerPath: 'applicationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state or localStorage
      const token = (getState() as any).auth?.token || localStorage.getItem('admin_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('accept', 'application/json')
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Application', 'ApplicationAnalytics'],
  endpoints: (builder) => ({
    // Get applications with filtering and pagination
    getApplications: builder.query<ApplicationListResponse, ApplicationFilters>({
      query: (filters) => ({
        url: '/applications',
        params: filters,
      }),
      providesTags: ['Application'],
    }),

    // Get application by ID
    getApplication: builder.query<Application, string>({
      query: (id) => `/applications/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Application', id }],
    }),

    // Get application analytics
    getApplicationAnalytics: builder.query<ApplicationAnalytics, void>({
      query: () => '/applications/analytics',
      providesTags: ['ApplicationAnalytics'],
    }),

    // Update application status
    updateApplicationStatus: builder.mutation<Application, { id: string } & ApplicationStatusUpdate>({
      query: ({ id, ...body }) => ({
        url: `/applications/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Application', id },
        'Application',
        'ApplicationAnalytics',
      ],
    }),

    // Bulk application operations
    bulkUpdateApplications: builder.mutation<{ success: boolean; affected: number }, BulkApplicationAction>({
      query: (body) => ({
        url: '/applications/bulk',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Application', 'ApplicationAnalytics'],
    }),

    // Delete application (admin only)
    deleteApplication: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/applications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Application', 'ApplicationAnalytics'],
    }),

    // Get applications for a specific job
    getJobApplications: builder.query<ApplicationListResponse, { jobId: string } & ApplicationFilters>({
      query: ({ jobId, ...filters }) => ({
        url: `/jobs/${jobId}/applications`,
        params: filters,
      }),
      providesTags: ['Application'],
    }),
  }),
})

export const {
  useGetApplicationsQuery,
  useGetApplicationQuery,
  useGetApplicationAnalyticsQuery,
  useUpdateApplicationStatusMutation,
  useBulkUpdateApplicationsMutation,
  useDeleteApplicationMutation,
  useGetJobApplicationsQuery,
} = applicationsApi