import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@/config/url'

// Conversation Interfaces
export interface ConversationUser {
  id: string
  name: string
  email: string
  avatar?: string
  userType: 'seeker' | 'helper' | 'admin'
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  formattedContent: string
  type: 'text' | 'file' | 'image' | 'system' | 'meeting_link' | 'contract_offer'
  attachments?: Array<{
    name: string
    size: string
    url: string
    type: string
  }>
  systemData?: Record<string, any>
  isRead: boolean
  readAt?: string
  readBy: string[]
  status: 'sent' | 'delivered' | 'read' | 'deleted'
  isEdited: boolean
  editedAt?: string
  replyToMessageId?: string
  replyToMessage?: Message
  createdAt: string
  updatedAt: string
  typeBadgeColor: string
  statusBadgeColor: string
  attachmentCount: number
}

export interface Conversation {
  id: string
  conversationId: string
  seekerId: string
  seekerName: string
  seekerEmail: string
  seekerAvatar?: string
  helperId: string
  helperName: string
  helperEmail: string
  helperAvatar?: string
  adminId?: string
  adminName?: string
  jobApplicationId?: string
  jobTitle?: string
  contractId?: string
  contractNumber?: string
  type: 'application' | 'contract' | 'support'
  subject?: string
  status: 'active' | 'closed' | 'archived'
  lastMessage?: string
  lastMessageUserId?: string
  lastMessageUserName?: string
  lastMessageAt?: string
  seekerLastReadAt?: string
  helperLastReadAt?: string
  adminLastReadAt?: string
  unreadCount: number
  hasUnreadForAdmin: boolean
  participants: {
    seeker: string
    helper: string
  }
  createdAt: string
  updatedAt: string
  statusBadgeColor: string
  typeBadgeColor: string
}

export interface ConversationFilters {
  search?: string
  type?: string[]
  status?: string[]
  hasUnread?: boolean
  participantId?: string
  jobApplicationId?: string
  contractId?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ConversationListResponse {
  conversations: Conversation[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface MessageFilters {
  conversationId: string
  type?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface MessageListResponse {
  messages: Message[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ConversationAnalytics {
  totalConversations: number
  activeConversations: number
  closedConversations: number
  archivedConversations: number
  unreadConversations: number
  totalMessages: number
  avgMessagesPerConversation: number
  newConversationsToday: number
  newConversationsThisWeek: number
  newConversationsThisMonth: number
  conversationsByType: Array<{
    type: string
    count: number
    percentage: number
  }>
  conversationsByStatus: Array<{
    status: string
    count: number
    percentage: number
  }>
  messagesByType: Array<{
    type: string
    count: number
    percentage: number
  }>
  responseTimeAnalytics: {
    averageResponseTime: number
    fastestResponseTime: number
    slowestResponseTime: number
  }
  busyHours: Array<{
    hour: number
    messageCount: number
  }>
}

export interface ConversationStatusUpdate {
  status: Conversation['status']
  reason?: string
}

export interface SendMessageRequest {
  conversationId: string
  content: string
  type?: Message['type']
  attachments?: Array<{
    name: string
    size: string
    url: string
    type: string
  }>
  replyToMessageId?: string
}

export interface AdminJoinConversationRequest {
  conversationId: string
  adminId: string
  notes?: string
}

export interface BulkConversationAction {
  conversationIds: string[]
  action: 'archive' | 'close' | 'reopen' | 'assign_admin' | 'delete'
  adminId?: string
  reason?: string
}

export const conversationsApi = createApi({
  reducerPath: 'conversationsApi',
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
  tagTypes: ['Conversation', 'Message', 'ConversationAnalytics'],
  endpoints: (builder) => ({
    // Get conversations with filtering and pagination
    getConversations: builder.query<ConversationListResponse, ConversationFilters>({
      query: (filters) => ({
        url: '/conversations',
        params: filters,
      }),
      providesTags: ['Conversation'],
    }),

    // Get conversation by ID
    getConversation: builder.query<Conversation, string>({
      query: (id) => `/conversations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Conversation', id }],
    }),

    // Get messages in a conversation
    getMessages: builder.query<MessageListResponse, MessageFilters>({
      query: ({ conversationId, ...filters }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: filters,
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'Message', id: conversationId },
      ],
    }),

    // Get conversation analytics
    getConversationAnalytics: builder.query<ConversationAnalytics, void>({
      query: () => '/conversations/analytics',
      providesTags: ['ConversationAnalytics'],
    }),

    // Send message to conversation
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Message', id: conversationId },
        { type: 'Conversation', id: conversationId },
        'Conversation',
        'ConversationAnalytics',
      ],
    }),

    // Update conversation status
    updateConversationStatus: builder.mutation<Conversation, { id: string } & ConversationStatusUpdate>({
      query: ({ id, ...body }) => ({
        url: `/conversations/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Conversation', id },
        'Conversation',
        'ConversationAnalytics',
      ],
    }),

    // Mark conversation as read for admin
    markConversationAsRead: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/conversations/${id}/mark-read`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Conversation', id },
        'Conversation',
      ],
    }),

    // Admin join conversation
    adminJoinConversation: builder.mutation<Conversation, AdminJoinConversationRequest>({
      query: ({ conversationId, ...body }) => ({
        url: `/conversations/${conversationId}/admin-join`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Conversation', id: conversationId },
        'Conversation',
        'ConversationAnalytics',
      ],
    }),

    // Bulk conversation operations
    bulkUpdateConversations: builder.mutation<{ success: boolean; affected: number }, BulkConversationAction>({
      query: (body) => ({
        url: '/conversations/bulk',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Conversation', 'ConversationAnalytics'],
    }),

    // Delete conversation (admin only)
    deleteConversation: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/conversations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Conversation', 'ConversationAnalytics'],
    }),

    // Edit message
    editMessage: builder.mutation<Message, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/messages/${id}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Message', id },
      ],
    }),

    // Delete message
    deleteMessage: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Message', id },
      ],
    }),
  }),
})

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useGetConversationAnalyticsQuery,
  useSendMessageMutation,
  useUpdateConversationStatusMutation,
  useMarkConversationAsReadMutation,
  useAdminJoinConversationMutation,
  useBulkUpdateConversationsMutation,
  useDeleteConversationMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
} = conversationsApi