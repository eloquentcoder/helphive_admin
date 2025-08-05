import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '../../../../config/url'

export type JobCategory = {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  parentName?: string
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
  maxSelections: number
  jobPostingsCount: number
  hasChildren: boolean
  createdAt: string
  updatedAt: string
}

export type JobCategoryFilters = {
  search?: string
  status?: 'active' | 'inactive'
  type?: 'parent' | 'subcategory'
  page?: number
  limit?: number
  sortBy?: 'name' | 'status' | 'sortOrder' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export type CreateJobCategoryRequest = {
  name: string
  description?: string
  parentId?: string
  icon?: string
  color?: string
  sortOrder?: number
  maxSelections?: number
  isActive?: boolean
}

export type UpdateJobCategoryRequest = Partial<CreateJobCategoryRequest> & {
  id: string
}

export type CategoryHierarchy = {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  children: Array<{
    id: string
    name: string
    slug: string
    description?: string
    icon?: string
    color?: string
  }>
}

export type CategoryAnalytics = {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  parentCategories: number
  subcategories: number
  emptCategories: number
  categoriesWithJobs: Array<{
    name: string
    job_count: number
  }>
}

export type UpdateSortOrderRequest = {
  categories: Array<{
    id: string
    sort_order: number
  }>
}

export const jobCategoriesApi = createApi({
  reducerPath: 'jobCategoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/job-categories`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token || localStorage.getItem('admin_token')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('content-type', 'application/json')
      headers.set('accept', 'application/json')
      return headers
    },
  }),
  tagTypes: ['JobCategory', 'CategoryAnalytics', 'CategoryHierarchy'],
  endpoints: (builder) => ({
    // Get paginated list of job categories
    getJobCategories: builder.query<
      {
        categories: JobCategory[]
        totalCount: number
        totalPages: number
        currentPage: number
        hasNextPage: boolean
        hasPreviousPage: boolean
      },
      JobCategoryFilters
    >({
      query: (filters) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })
        return `/?${params.toString()}`
      },
      providesTags: (result) =>
        result?.categories
          ? [
              ...result.categories.map(({ id }) => ({ type: 'JobCategory' as const, id })),
              { type: 'JobCategory', id: 'LIST' },
            ]
          : [{ type: 'JobCategory', id: 'LIST' }],
    }),

    // Get single job category
    getJobCategory: builder.query<JobCategory, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'JobCategory', id }],
    }),

    // Create new job category
    createJobCategory: builder.mutation<JobCategory, CreateJobCategoryRequest>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'JobCategory', id: 'LIST' },
        'CategoryAnalytics',
        'CategoryHierarchy',
      ],
    }),

    // Update job category
    updateJobCategory: builder.mutation<JobCategory, UpdateJobCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'JobCategory', id },
        { type: 'JobCategory', id: 'LIST' },
        'CategoryAnalytics',
        'CategoryHierarchy',
      ],
    }),

    // Delete job category
    deleteJobCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'JobCategory', id },
        { type: 'JobCategory', id: 'LIST' },
        'CategoryAnalytics',
        'CategoryHierarchy',
      ],
    }),

    // Get category hierarchy
    getCategoryHierarchy: builder.query<{ categories: CategoryHierarchy[] }, void>({
      query: () => '/hierarchy',
      providesTags: ['CategoryHierarchy'],
    }),

    // Update sort order
    updateSortOrder: builder.mutation<{ message: string }, UpdateSortOrderRequest>({
      query: (body) => ({
        url: '/sort-order',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [
        { type: 'JobCategory', id: 'LIST' },
        'CategoryHierarchy',
      ],
    }),

    // Get analytics
    getCategoryAnalytics: builder.query<CategoryAnalytics, void>({
      query: () => '/analytics',
      providesTags: ['CategoryAnalytics'],
    }),
  }),
})

export const {
  useGetJobCategoriesQuery,
  useGetJobCategoryQuery,
  useCreateJobCategoryMutation,
  useUpdateJobCategoryMutation,
  useDeleteJobCategoryMutation,
  useGetCategoryHierarchyQuery,
  useUpdateSortOrderMutation,
  useGetCategoryAnalyticsQuery,
} = jobCategoriesApi