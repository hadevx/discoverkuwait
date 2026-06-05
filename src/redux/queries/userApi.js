import { apiSlice } from "./apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/register",
        method: "POST",
        body: data,
      }),
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: "/api/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getUserDetails: builder.query({
      query: (userId) => ({
        url: `/api/users/${userId}`,
      }),
      providesTags: ["User"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `/api/users/profile`,
      }),
      providesTags: ["User"],
    }),
    getBlockStatus: builder.query({
      query: (id) => ({
        url: `/api/users/block-status/${id}`,
      }),
    }),
    getLatestUsers: builder.query({
      query: () => ({
        url: `/api/users/latest`,
      }),
    }),
    getLeaderboard: builder.query({
      query: (limit = 10) => ({
        url: `/api/users/leaderboard`,
        params: { limit },
      }),
    }),
    logoutApi: builder.mutation({
      query: () => ({
        url: `/api/users/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,

  useGetUserDetailsQuery,
  useLogoutApiMutation,

  useUpdateUserMutation,

  useGetBlockStatusQuery,

  useGetUserProfileQuery,

  useGetLatestUsersQuery,
  useGetLeaderboardQuery,
} = userApi;
