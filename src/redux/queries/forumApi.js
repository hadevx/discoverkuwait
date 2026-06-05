import { apiSlice } from "./apiSlice";

export const topicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all topics with optional category and search
    getTopics: builder.query({
      query: ({ pageNumber = 1, category = "", search = "" }) => {
        let url = `/api/topics?pageNumber=${pageNumber}`;

        if (search) url += `&keyword=${search}`;
        if (category) url += `&category=${category}`;

        return { url };
      },
      providesTags: ["Topic"],
    }),

    // Get a single topic by ID
    getTopicById: builder.query({
      query: (id) => ({
        url: `/api/topics/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Topic", id }],
    }),

    // Create a new topic
    createTopic: builder.mutation({
      query: (topic) => ({
        url: "/api/topics",
        method: "POST",
        body: topic,
      }),
      invalidatesTags: ["Topic"],
    }),

    // Update a topic
    updateTopic: builder.mutation({
      query: ({ topicId, title, description, category }) => ({
        url: `/api/topics/${topicId}`,
        method: "PUT",
        body: { title, description, category },
      }),
      invalidatesTags: (result, error, { topicId }) => [{ type: "Topic", id: topicId }],
    }),

    // Delete a topic
    deleteTopic: builder.mutation({
      query: ({ topicId }) => ({
        url: `/api/topics/${topicId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topic"],
    }),

    // Add comment to topic
    addComment: builder.mutation({
      query: ({ topicId, comment }) => ({
        url: `/api/topics/${topicId}/comments`,
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, { topicId }) => [{ type: "Topic", id: topicId }],
    }),

    // Delete comment from topic
    deleteComment: builder.mutation({
      query: ({ topicId, commentId }) => ({
        url: `/api/topics/${topicId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { topicId }) => [{ type: "Topic", id: topicId }],
    }),

    closeTopic: builder.mutation({
      query: (topicId) => ({
        url: `/api/topics/${topicId}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, topicId) => [{ type: "Topic", id: topicId }],
    }),
    // Delete a topic
    adminDeleteTopic: builder.mutation({
      query: (topicId) => ({
        url: `/api/topics/admin/${topicId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topic"],
    }),
    likeTopic: builder.mutation({
      query: ({ topicId }) => ({
        url: `/api/topics/${topicId}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Topic"],
    }),
    // Delete comment from topic (admin)
    adminDeleteComment: builder.mutation({
      query: ({ topicId, commentId }) => ({
        url: `/api/topics/admin/${topicId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { topicId }) => [{ type: "Topic", id: topicId }],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGetTopicByIdQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useCloseTopicMutation,
  useAdminDeleteTopicMutation,
  useAdminDeleteCommentMutation,
  useLikeTopicMutation,
} = topicApi;
