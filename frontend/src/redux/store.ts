import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "./api/UserAPI";

export const server=import.meta.env.VITE_SERVER_URL
export const store=configureStore({
    reducer:{
        [UserApi.reducerPath]:UserApi.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware()
                                      .concat(UserApi.middleware)
})