import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CartResponse, DeleteCartRequest, MessageResponse, NewCartRequest } from "../../types/api.types";

export const CartApi=createApi({
    reducerPath:"cartApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER_URL}/api/v1/cart/`}),
    tagTypes:["Cart"],
    endpoints:(builder)=>({
        addToCart:builder.mutation<MessageResponse,NewCartRequest>({
            query:({userId,cartItems})=>({
                url:"?userId="+userId,
                method:"POST",
                body:cartItems
            }),
            invalidatesTags:["Cart"]
        }),
        getCart:builder.query<CartResponse,string>({
            query:(userId)=>`?userId=${userId}`,
            providesTags:["Cart"]
        }),
        deleteCartItem:builder.mutation<MessageResponse,DeleteCartRequest>({
            query:({userId,productID})=>({
                url:`?userId=${userId}&productID=${productID}`,
                method:"DELETE"
            }),
            invalidatesTags:["Cart"]
        }),
        deleteCart:builder.mutation<MessageResponse,string>({
            query:(userId)=>({
                url:`${userId}`,
                method:"DELETE"
            }),
            invalidatesTags:["Cart"]
        })
    })
});

export const {
    useAddToCartMutation,
    useGetCartQuery,
    useDeleteCartItemMutation,
    useDeleteCartMutation
}=CartApi;