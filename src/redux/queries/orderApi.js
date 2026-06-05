import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/api/orders",
        method: "POST",
        body: { ...order },
      }),
    }),
    getOrder: builder.query({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: "/api/orders/mine",
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    getPayPalClientId: builder.query({
      query: () => ({
        url: "/api/config/paypal",
      }),
      keepUnusedDataFor: 5,
    }),
    /*     // 🔹 NEW: Create Tap payment
    createTapPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/api/payment/create", // Your Tap backend endpoint
        method: "POST",
        body: paymentData,
      }),
    }), */
    // redux/queries/orderApi.js
    checkStock: builder.mutation({
      query: (payload) => ({
        url: "/api/orders/check-stock",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetMyOrdersQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useCreateTapPaymentMutation, // export new hook
  useCheckStockMutation,
} = orderApi;
