import { API_URL } from '@/config/url'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Job {
  id: string
  title: string
  category: string
  summary: string
  employerId: string
  employerName: string
  employerLocation: string
  preferredAgeRange: {
    min: number
    max: number
  }
  salaryRange: {
    min: number
    max: number
    currency: 'QAR'
  }
  duration: string
  workType: 'come_and_go' | 'live_in'
  status: 'draft' | 'published' | 'paused' | 'stopped' | 'expired'
  accommodationImages?: string[]
  documents?: string[]
  customQuestions: {
    id: string
    question: string
    type: 'text' | 'choice'
    options?: string[]
    required: boolean
  }[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  applicationCount: number
  viewCount: number
  isPaid: boolean
  paymentAmount?: number
}

export interface JobApplication {
  id: string
  jobId: string
  helperId: string
  helperName: string
  helperAge: number
  helperLocation: string
  helperAvatar?: string
  helperRating: number
  isPerfectMatch: boolean
  status: 'applied' | 'viewed' | 'contacted' | 'meeting_requested' | 'meeting_scheduled' | 'contract_offered' | 'contract_accepted' | 'contract_declined' | 'hired'
  answers: {
    questionId: string
    answer: string
  }[]
  appliedAt: string
  contactedAt?: string
  meetingScheduledAt?: string
  contractOfferedAt?: string
  contractAmount?: number
}

export interface JobContract {
  id: string
  jobId: string
  applicationId: string
  employerId: string
  helperId: string
  jobTitle: string
  employerName: string
  helperName: string
  agreedAmount: number
  platformFee: number
  totalAmount: number
  startDate: string
  endDate?: string
  status: 'pending_payment' | 'active' | 'completed' | 'cancelled' | 'disputed'
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue'
  createdAt: string
  signedAt?: string
  completedAt?: string
}

export interface JobsFilter {
  search?: string
  category?: string[]
  status?: string[]
  workType?: string[]
  employerId?: string
  dateFrom?: string
  dateTo?: string
  salaryMin?: number
  salaryMax?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface JobsResponse {
  jobs: Job[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface JobAnalytics {
  totalJobs: number
  activeJobs: number
  draftJobs: number
  pausedJobs: number
  expiredJobs: number
  totalApplications: number
  totalContracts: number
  activeContracts: number
  completedContracts: number
  averageApplicationsPerJob: number
  topCategories: {
    category: string
    count: number
    percentage: number
  }[]
  jobsByStatus: {
    status: string
    count: number
    percentage: number
  }[]
  revenueFromJobPostings: number
  revenueFromContracts: number
}

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + '/jobs',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Job', 'JobApplication', 'JobContract', 'JobAnalytics'],
  endpoints: (builder) => ({
    // Get jobs with filtering and pagination
    getJobs: builder.query<JobsResponse, JobsFilter>({
      query: (filters) => ({
        url: '',
        params: filters,
      }),
      providesTags: ['Job'],
    }),

    // Get single job details
    getJob: builder.query<Job, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    // Get job applications
    getJobApplications: builder.query<
      {
        applications: JobApplication[]
        totalCount: number
      },
      { jobId: string; page?: number; limit?: number }
    >({
      query: ({ jobId, page = 1, limit = 20 }) => ({
        url: `/${jobId}/applications`,
        params: { page, limit },
      }),
      providesTags: (result, error, { jobId }) => [
        { type: 'JobApplication', id: jobId },
      ],
    }),

    // Get all applications with filtering
    getAllApplications: builder.query<
      {
        applications: JobApplication[]
        totalCount: number
      },
      { 
        status?: string[]
        helperId?: string
        employerId?: string
        page?: number
        limit?: number
      }
    >({
      query: (filters) => ({
        url: '/applications',
        params: filters,
      }),
      providesTags: ['JobApplication'],
    }),

    // Get job contracts
    getJobContracts: builder.query<
      {
        contracts: JobContract[]
        totalCount: number
      },
      {
        status?: string[]
        employerId?: string
        helperId?: string
        page?: number
        limit?: number
      }
    >({
      query: (filters) => ({
        url: '/contracts',
        params: filters,
      }),
      providesTags: ['JobContract'],
    }),

    // Get job analytics
    getJobAnalytics: builder.query<JobAnalytics, void>({
      query: () => '/analytics',
      providesTags: ['JobAnalytics'],
    }),

    // Update job status (admin action)
    updateJobStatus: builder.mutation<
      Job,
      { id: string; status: Job['status']; reason?: string }
    >({
      query: ({ id, status, reason }) => ({
        url: `/${id}/status`,
        method: 'PATCH',
        body: { status, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Job', id },
        'Job',
        'JobAnalytics',
      ],
    }),

    // Update application status (admin intervention)
    updateApplicationStatus: builder.mutation<
      JobApplication,
      { 
        applicationId: string
        status: JobApplication['status']
        reason?: string
        adminNote?: string
      }
    >({
      query: ({ applicationId, status, reason, adminNote }) => ({
        url: `/applications/${applicationId}/status`,
        method: 'PATCH',
        body: { status, reason, adminNote },
      }),
      invalidatesTags: (result, error, { applicationId }) => [
        { type: 'JobApplication', id: applicationId },
        'JobApplication',
      ],
    }),

    // Update contract status (admin intervention)
    updateContractStatus: builder.mutation<
      JobContract,
      {
        contractId: string
        status: JobContract['status']
        reason?: string
        adminNote?: string
      }
    >({
      query: ({ contractId, status, reason, adminNote }) => ({
        url: `/contracts/${contractId}/status`,
        method: 'PATCH',
        body: { status, reason, adminNote },
      }),
      invalidatesTags: (result, error, { contractId }) => [
        { type: 'JobContract', id: contractId },
        'JobContract',
        'JobAnalytics',
      ],
    }),

    // Resolve contract dispute
    resolveContractDispute: builder.mutation<
      JobContract,
      {
        contractId: string
        resolution: 'favor_employer' | 'favor_helper' | 'partial_refund'
        refundAmount?: number
        adminNote: string
      }
    >({
      query: ({ contractId, ...body }) => ({
        url: `/contracts/${contractId}/resolve-dispute`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { contractId }) => [
        { type: 'JobContract', id: contractId },
        'JobContract',
        'JobAnalytics',
      ],
    }),

    // Bulk job actions
    bulkUpdateJobs: builder.mutation<
      { success: boolean; affected: number },
      {
        jobIds: string[]
        action: 'publish' | 'pause' | 'stop' | 'delete' | 'extend'
        reason?: string
      }
    >({
      query: (bulkAction) => ({
        url: '/bulk',
        method: 'PATCH',
        body: bulkAction,
      }),
      invalidatesTags: ['Job', 'JobAnalytics'],
    }),

    // Export jobs data
    exportJobs: builder.mutation<
      { downloadUrl: string },
      JobsFilter
    >({
      query: (filters) => ({
        url: '/export',
        method: 'POST',
        body: filters,
      }),
    }),
  }),
})

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useGetJobApplicationsQuery,
  useGetAllApplicationsQuery,
  useGetJobContractsQuery,
  useGetJobAnalyticsQuery,
  useUpdateJobStatusMutation,
  useUpdateApplicationStatusMutation,
  useUpdateContractStatusMutation,
  useResolveContractDisputeMutation,
  useBulkUpdateJobsMutation,
  useExportJobsMutation,
} = jobsApi