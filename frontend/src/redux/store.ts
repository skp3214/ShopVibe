import { configureStore } from "@reduxjs/toolkit";
import { UserApi } from "./api/UserAPI";
import { UserReducer } from "./reducer/UserReducer";
import { ProductApi } from "./api/ProductAPI";
import { CartReducer } from "./reducer/CartReducer";
import { OrderApi } from "./api/OrderAPI";
import { DashBoardApi } from "./api/DashBoardAPI";
import { PaymentApi } from "./api/PaymentAPI";
import { CartApi } from "./api/CartAPI";

export const server = import.meta.env.VITE_SERVER_URL
export const store = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        [ProductApi.reducerPath]: ProductApi.reducer,
        [UserReducer.name]: UserReducer.reducer,
        [CartReducer.name]: CartReducer.reducer,
        [OrderApi.reducerPath]: OrderApi.reducer,
        [DashBoardApi.reducerPath]: DashBoardApi.reducer,
        [PaymentApi.reducerPath]:PaymentApi.reducer,
        [CartApi.reducerPath]:CartApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(UserApi.middleware)
        .concat(ProductApi.middleware)
        .concat(OrderApi.middleware)
        .concat(DashBoardApi.middleware)
        .concat(PaymentApi.middleware)
        .concat(CartApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>;