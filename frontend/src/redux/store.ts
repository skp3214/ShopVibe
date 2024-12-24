import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "./api/UserAPI";
import { UserReducer } from "./reducer/UserReducer";
import { ProductApi } from "./api/ProductAPI";

export const server=import.meta.env.VITE_SERVER_URL
export const store=configureStore({
    reducer:{
        [UserApi.reducerPath]:UserApi.reducer,
        [ProductApi.reducerPath]:ProductApi.reducer,
        [UserReducer.name]:UserReducer.reducer,
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware()
                                      .concat(UserApi.middleware)
                                        .concat(ProductApi.middleware)
})