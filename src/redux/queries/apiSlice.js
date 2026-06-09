import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backend =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? import.meta.env.VITE_API_LOCALHOST
    : import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: backend,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Status", "Topic", "Course", "Forum", "ForumPending", "Competition"],
  endpoints: () => ({}),
});
