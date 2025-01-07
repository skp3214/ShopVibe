import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrderResponse, MessageResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from "../../types/api.types";

export const OrderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/order/` }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        createOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (order) => ({
                url: "new",
                method: "POST",
                body: order
            }),
            invalidatesTags: ["Order"]
        }),
        myOrders: builder.query<AllOrderResponse, string>({
            query: (id) => `my?id=${id}`,
            providesTags: ["Order"]
        }),
        allOrders: builder.query<AllOrderResponse, string>({
            query: (id) => "all?id=" + id,
            providesTags: ["Order"]
        }),
        orderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => id,
            providesTags: ["Order"]
        }),
        updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
            query: ({ orderId, userId }) => ({
                url: `${orderId}?id=${userId}`,
                method: "PUT",
            }),
            invalidatesTags: ["Order"]
        }),
        deleteOrder: builder.mutation<MessageResponse,UpdateOrderRequest>({
            query: ({ orderId, userId }) => ({
                url: `${orderId}?id=${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Order"]
        })
    })
})
export const { useCreateOrderMutation, useMyOrdersQuery, useAllOrdersQuery, useOrderDetailsQuery, useUpdateOrderMutation, useDeleteOrderMutation } = OrderApi;