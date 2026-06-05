import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNumber = 1, keyword = "" }) => ({
        url: `/api/products?pageNumber=${pageNumber}&keyword=${keyword}`,
      }),
      providesTags: ["Product"],
    }),
    getCourses: builder.query({
      query: ({ pageNumber = 1, keyword = "" }) => ({
        url: `/api/course?pageNumber=${pageNumber}&keyword=${keyword}`,
      }),
      providesTags: ["Course"],
    }),
    getCourseById: builder.query({
      query: (id) => ({
        url: `/api/course/${id}`,
      }),
      providesTags: ["Course"],
    }),
    getFeaturedCourses: builder.query({
      query: () => ({
        url: "/api/course/featured",
      }),
    }),
    getProductsByCourse: builder.query({
      query: ({ courseId }) => ({
        url: `/api/products/course/${courseId}`,
      }),
    }),
    likeCourse: builder.mutation({
      query: ({ courseId }) => ({
        url: `/api/course/${courseId}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Course"],
    }),
    downloadResource: builder.query({
      query: (id) => ({
        url: `/api/upload/download/${id}`,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return {
            blob,
            filename:
              response.headers.get("content-disposition")?.split("filename=")[1] ||
              "downloaded-file",
          };
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetFeaturedCoursesQuery,
  useGetProductsByCourseQuery,
  useLazyDownloadResourceQuery,
  useLikeCourseMutation,
} = productApi;
