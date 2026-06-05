import { apiSlice } from "./apiSlice";

const wordsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all words (with optional filters)
    getWords: builder.query({
      query: (params) => ({
        url: "/api/words",
        params, // e.g. { category, search, page }
      }),
      providesTags: ["Word"],
    }),

    // Get single word by ID
    getWordById: builder.query({
      query: (id) => ({
        url: `/api/words/${id}`,
      }),
      providesTags: ["Word"],
    }),

    // Submit a new word (any logged-in user — goes to pending queue)
    submitWord: builder.mutation({
      query: (data) => ({
        url: "/api/words",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Word", "MyWords"],
    }),

    // Create a new word (admin — auto-approved)
    createWord: builder.mutation({
      query: (data) => ({
        url: "/api/words",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Word"],
    }),

    // Get the current user's own submissions
    getMySubmissions: builder.query({
      query: () => "/api/words/mine",
      providesTags: ["MyWords"],
    }),

    // Approve / unapprove a word (admin toggle)
    approveWord: builder.mutation({
      query: (id) => ({
        url: `/api/words/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Word"],
    }),

    // Update a word (admin)
    updateWord: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/words/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Word"],
    }),

    // Delete a word (admin)
    deleteWord: builder.mutation({
      query: (id) => ({
        url: `/api/words/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Word"],
    }),

    // Get words by category
    getWordsByCategory: builder.query({
      query: (category) => ({
        url: `/api/words/category/${category}`,
      }),
      providesTags: ["Word"],
    }),

    // Get random words (for quiz)
    getRandomWords: builder.query({
      query: (count = 10) => ({
        url: `/api/words/random`,
        params: { count },
      }),
    }),
    likeWord: builder.mutation({
      query: (id) => ({ url: `/api/words/${id}/like`, method: "POST" }),
      invalidatesTags: ["Word"],
    }),
  }),
});

export const {
  useGetWordsQuery,
  useGetWordByIdQuery,
  useSubmitWordMutation,
  useCreateWordMutation,
  useGetMySubmissionsQuery,
  useApproveWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
  useGetWordsByCategoryQuery,
  useGetRandomWordsQuery,
  useLikeWordMutation,
} = wordsApi;
