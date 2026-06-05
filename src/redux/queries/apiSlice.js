import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backend = "http://localhost:4001";
/*   process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_LOCALHOST; */

const baseQuery = fetchBaseQuery({
  baseUrl: backend,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Status", "Topic", "Course"],
  endpoints: () => ({}),
});
