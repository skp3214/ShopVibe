import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "./api/UserAPI";
import { UserReducer } from "./reducer/UserReducer";
import { ProductApi } from "./api/ProductAPI";
import { CartReducer } from "./reducer/CartReducer";
import { OrderApi } from "./api/OrderAPI";

export const server = import.meta.env.VITE_SERVER_URL
export const store = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        [ProductApi.reducerPath]: ProductApi.reducer,
        [UserReducer.name]: UserReducer.reducer,
        [CartReducer.name]: CartReducer.reducer,
        [OrderApi.reducerPath]: OrderApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(UserApi.middleware)
        .concat(ProductApi.middleware)
        .concat(OrderApi.middleware)
})