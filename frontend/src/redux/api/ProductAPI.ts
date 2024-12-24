import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductResponse, CategoriesResponse, DeleteProductRequestBody, MessageResponse, NewProductRequestBody, ProductResponse, SearchedProductRequest, SearchedProductsResponse, UpdateProductRequestBody } from "../../types/api.types";

export const ProductApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/product/` }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        latestProducts: builder.query<AllProductResponse, string>({
            query: () => "latest",
            providesTags:["Product"]
        }),
        allProducts: builder.query<AllProductResponse, string>({
            query: () => "admin-products",
            providesTags:["Product"]

        }),
        categories: builder.query<CategoriesResponse, string>({
            query: () => "categories",
            providesTags:["Product"]

        }),
        searchedProducts: builder.query<SearchedProductsResponse, SearchedProductRequest>({
            query: (arg) => "all?" + new URLSearchParams({
                search: arg.search,
                category: arg.category,
                sort: arg.sort,
                price: arg.price.toString(),
                page: arg.page.toString()
            }).toString(),
            providesTags:["Product"]

        }),
        newProduct:builder.mutation<MessageResponse,NewProductRequestBody>({
            query:({id,formData})=>({
                url:`new?id=${id}`,
                method:"POST",
                body:formData
            }),
            invalidatesTags:["Product"]
        }),
        productDetails: builder.query<ProductResponse, string>({
            query: (id) => id,
            providesTags:["Product"]
        }),
        updateProduct:builder.mutation<MessageResponse,UpdateProductRequestBody>({
            query:({userId,productId,formData})=>({
                url:`${productId}?id=${userId}`,
                method:"PUT",
                body:formData
            }),
            invalidatesTags:["Product"]
        }),
        deleteProduct:builder.mutation<MessageResponse,DeleteProductRequestBody>({
            query:({userId,productId})=>({
                url:`${productId}?id=${userId}`,
                method:"DELETE",
            }),
            invalidatesTags:["Product"]
        }),

    }),
});

export const { 
    useLatestProductsQuery, 
    useAllProductsQuery, 
    useCategoriesQuery,
    useSearchedProductsQuery,
    useNewProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = ProductApi;