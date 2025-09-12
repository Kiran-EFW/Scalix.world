import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

// Create a base query with auth headers
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any)?.auth?.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const scalixApi = createApi({
  reducerPath: 'scalixApi',
  baseQuery,
  tagTypes: ['User', 'Projects', 'Billing', 'Usage', 'Teams', 'Admin'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // User endpoints
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Projects endpoints
    getProjects: builder.query({
      query: ({ page = 1, limit = 10 }) => `/projects?page=${page}&limit=${limit}`,
      providesTags: ['Projects'],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: ['Projects'],
    }),
    createProject: builder.mutation({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    // Billing endpoints
    getSubscription: builder.query({
      query: () => '/billing/subscription',
      providesTags: ['Billing'],
    }),
    getInvoices: builder.query({
      query: ({ page = 1, limit = 10 }) => `/billing/invoices?page=${page}&limit=${limit}`,
      providesTags: ['Billing'],
    }),
    createPaymentMethod: builder.mutation({
      query: (paymentMethod) => ({
        url: '/billing/payment-methods',
        method: 'POST',
        body: paymentMethod,
      }),
      invalidatesTags: ['Billing'],
    }),
    upgradeSubscription: builder.mutation({
      query: (planData) => ({
        url: '/billing/upgrade',
        method: 'POST',
        body: planData,
      }),
      invalidatesTags: ['Billing'],
    }),

    // Usage endpoints
    getUsageStats: builder.query({
      query: ({ period = '30d' } = {}) => `/usage/stats?period=${period}`,
      providesTags: ['Usage'],
    }),
    getUsageHistory: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => `/usage/history?page=${page}&limit=${limit}`,
      providesTags: ['Usage'],
    }),

    // Teams endpoints
    getTeams: builder.query({
      query: () => '/teams',
      providesTags: ['Teams'],
    }),
    getTeam: builder.query({
      query: (id) => `/teams/${id}`,
      providesTags: ['Teams'],
    }),
    createTeam: builder.mutation({
      query: (team) => ({
        url: '/teams',
        method: 'POST',
        body: team,
      }),
      invalidatesTags: ['Teams'],
    }),

    // Admin endpoints
    getUsers: builder.query({
      query: ({ page = 1, limit = 20, search } = {}) =>
        `/admin/users?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
      providesTags: ['Admin'],
    }),
    getAnalytics: builder.query({
      query: ({ period = '30d' } = {}) => `/admin/analytics?period=${period}`,
      providesTags: ['Admin'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetSubscriptionQuery,
  useGetInvoicesQuery,
  useCreatePaymentMethodMutation,
  useUpgradeSubscriptionMutation,
  useGetUsageStatsQuery,
  useGetUsageHistoryQuery,
  useGetTeamsQuery,
  useGetTeamQuery,
  useCreateTeamMutation,
  useGetUsersQuery,
  useGetAnalyticsQuery,
} = scalixApi
