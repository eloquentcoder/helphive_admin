import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/config/url'

// Contract Interfaces
export interface Contract {
  id: string
  jobId: string
  jobTitle: string
  applicationId: string
  employerId: string
  employerName: string
  helperId: string
  helperName: string
  helperAvatar?: string
  agreedAmount: number
  platformFee: number
  totalAmount: number
  startDate: string
  endDate?: string
  status: 'pending_payment' | 'active' | 'completed' | 'cancelled' | 'disputed'
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue'
  signedAt?: string
  paymentDueAt?: string
  completedAt?: string
  cancelledAt?: string
  disputeReason?: string
  disputeRaisedAt?: string
  disputeResolution?: string
  disputeResolvedAt?: string
  disputeOutcome?: 'favor_employer' | 'favor_helper' | 'partial_refund'
  refundAmount?: number
  adminNotes?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
  durationInDays: number
  daysRemaining: number
  statusBadgeColor: string
  paymentStatusBadgeColor: string
}

export interface ContractFilters {
  search?: string
  status?: string[]
  paymentStatus?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ContractListResponse {
  contracts: Contract[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ContractAnalytics {
  totalContracts: number
  activeContracts: number
  completedContracts: number
  disputedContracts: number
  overduePayments: number
  totalEarnings: number
  pendingPayments: number
  newContractsToday: number
  newContractsThisWeek: number
  newContractsThisMonth: number
  contractsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  contractsByPaymentStatus: Array<{
    paymentStatus: string
    count: number
    percentage: number
  }>
  averageContractValue: number
  averageContractDuration: number
}

export interface BulkContractAction {
  contractIds: string[]
  action: 'activate' | 'complete' | 'cancel' | 'resolve_dispute' | 'mark_paid'
  reason?: string
  resolution?: string
  outcome?: string
}

export interface ContractStatusUpdate {
  status: Contract['status']
  reason?: string
}

export interface ContractPaymentUpdate {
  paymentStatus: Contract['paymentStatus']
  notes?: string
}

export interface ContractDispute {
  reason: string
  evidence?: string[]
}

export interface DisputeResolution {
  outcome: Contract['disputeOutcome']
  resolution: string
  refundAmount?: number
}

export const contractsApi = createApi({
  reducerPath: 'contractsApi',
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
  tagTypes: ['Contract', 'ContractAnalytics'],
  endpoints: (builder) => ({
    // Get contracts with filtering and pagination
    getContracts: builder.query<ContractListResponse, ContractFilters>({
      query: (filters) => ({
        url: '/contract',
        params: filters,
      }),
      providesTags: ['Contract'],
    }),

    // Get contract by ID
    getContract: builder.query<Contract, string>({
      query: (id) => `/contract/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Contract', id }],
    }),

    // Get contract analytics
    getContractAnalytics: builder.query<ContractAnalytics, void>({
      query: () => '/contract/analytics',
      providesTags: ['ContractAnalytics'],
    }),

    // Update contract status
    updateContractStatus: builder.mutation<Contract, { id: string } & ContractStatusUpdate>({
      query: ({ id, ...body }) => ({
        url: `/contract/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contract', id },
        'Contract',
        'ContractAnalytics',
      ],
    }),

    // Update payment status
    updatePaymentStatus: builder.mutation<Contract, { id: string } & ContractPaymentUpdate>({
      query: ({ id, ...body }) => ({
        url: `/contract/${id}/payment`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contract', id },
        'Contract',
        'ContractAnalytics',
      ],
    }),

    // Raise dispute
    raiseDispute: builder.mutation<Contract, { id: string } & ContractDispute>({
      query: ({ id, ...body }) => ({
        url: `/contract/${id}/dispute`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contract', id },
        'Contract',
        'ContractAnalytics',
      ],
    }),

    // Resolve dispute
    resolveDispute: builder.mutation<Contract, { id: string } & DisputeResolution>({
      query: ({ id, ...body }) => ({
        url: `/contract/${id}/dispute/resolve`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Contract', id },
        'Contract',
        'ContractAnalytics',
      ],
    }),

    // Bulk contract operations
    bulkUpdateContracts: builder.mutation<{ success: boolean; affected: number }, BulkContractAction>({
      query: (body) => ({
        url: '/contract/bulk',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Contract', 'ContractAnalytics'],
    }),

    // Delete contract (admin only)
    deleteContract: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/contract/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contract', 'ContractAnalytics'],
    }),
  }),
})

export const {
  useGetContractsQuery,
  useGetContractQuery,
  useGetContractAnalyticsQuery,
  useUpdateContractStatusMutation,
  useUpdatePaymentStatusMutation,
  useRaiseDisputeMutation,
  useResolveDisputeMutation,
  useBulkUpdateContractsMutation,
  useDeleteContractMutation,
} = contractsApi