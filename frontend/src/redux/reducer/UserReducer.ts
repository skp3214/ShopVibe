import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerIntialState } from "../../types/reducer.types";
import { User } from "../../types/types";

const initialState:UserReducerIntialState = {
    user:null,
    loading:true
};

export const UserReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action:PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
    },
    userNotExist: (state) => {
        state.user = null;
        state.loading = false;
    }
  },
});

export const { userExist, userNotExist } = UserReducer.actions;