import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllDiscountResponse, CommonDiscountCouponRequest, DiscountMessageResponse, NewDiscountCouponRequest, SingleDiscountResponse, UpdateDiscountCouponRequest } from "../../types/api.types";

export const PaymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/payment/` }),
    tagTypes:["Payment"],
    endpoints: (builder) => ({
        createCoupon: builder.mutation<DiscountMessageResponse, NewDiscountCouponRequest>({
            query: ({ formData, userId }) => ({
                url: "coupon/new?id=" + userId,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Payment"]
        }),
        allCoupons:builder.query<AllDiscountResponse,string>({
            query:(id)=>"coupon/all?id="+id,
            providesTags:["Payment"]
        }),
        getCouponDetail:builder.query<SingleDiscountResponse,CommonDiscountCouponRequest>({
            query:({couponId,userId})=>({
                url:`coupon/${couponId}?id=`+userId,
                method:"GET"
            }),
            providesTags:["Payment"]
        }),
        updateCoupon:builder.mutation<DiscountMessageResponse,UpdateDiscountCouponRequest>({
            query:({couponId,userId,formData})=>({
                url:`coupon/${couponId}?id=`+userId,
                method:"PUT",
                body:formData
            }),
            invalidatesTags:["Payment"]
        }),
        deleteCoupon:builder.mutation<DiscountMessageResponse,CommonDiscountCouponRequest>({
            query:({couponId,userId})=>({
                url:`coupon/${couponId}?id=`+userId,
                method:"DELETE"
            }),
            invalidatesTags:["Payment"]
        })
    })
})

export const {
    useCreateCouponMutation,
    useAllCouponsQuery,
    useGetCouponDetailQuery,
    useUpdateCouponMutation,
    useDeleteCouponMutation
}=PaymentApi
