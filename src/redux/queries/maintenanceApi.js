import { apiSlice } from "./apiSlice";

export const maintenanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStoreStatus: builder.query({
      query: () => ({
        url: "/api/update-store-status",
      }),
    }),
  }),
});

export const { useGetStoreStatusQuery } = maintenanceApi;
