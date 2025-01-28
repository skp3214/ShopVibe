import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerIntialState } from "../../types/reducer.types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerIntialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: '',
        city: '',
        state: '',
        pinCode: '',
        country: '',
    }
}
export const CartReducer = createSlice({
    name: 'cartReducer',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem[]>) => {
            state.loading = true;
            state.cartItems = action.payload;
            state.loading = false;
        },
        calculatePrice:(state)=>{
            const subtotal=state.cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0);
            state.subtotal=subtotal;
            state.tax=Math.round(state.subtotal*0.18);
            state.shippingCharges=state.subtotal>1000?0:200;
            state.total=state.subtotal+state.tax+state.shippingCharges-state.discount;
        },
        discountApplied:(state,action: PayloadAction<number>)=>{
            state.discount=action.payload;
        },
        saveShippingInfo:(state,action: PayloadAction<ShippingInfo>)=>{
            state.shippingInfo=action.payload;
        },
        resetCart:()=>initialState
    }
})

export const { addToCart, calculatePrice,discountApplied, saveShippingInfo,resetCart } = CartReducer.actions;