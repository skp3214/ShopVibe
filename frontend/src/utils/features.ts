import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { DiscountMessageResponse, MessageResponse } from "../types/api.types"
import { SerializedError } from "@reduxjs/toolkit"
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType =
    | {
        data: MessageResponse
    }
    | {
        error: FetchBaseQueryError | SerializedError
    };

export const responseToast = (res:ResType,navigate:NavigateFunction|null,url:string) => {
    if ("data" in res) {
        if (res.data.status) {
            toast.success(res.data.message);
            if (navigate) navigate(url);
        } else {
            toast.error(res.data.message);
        }
    } else {
        const error = res.error as FetchBaseQueryError;
        const messageResponse=error.data as MessageResponse;
        toast.error(messageResponse.message);
    }
}
type ResTypeDiscount =
    | {
        data: DiscountMessageResponse
    }
    | {
        error: FetchBaseQueryError | SerializedError
    };

export const responseToastDiscount = (res:ResTypeDiscount,navigate:NavigateFunction|null,url:string) => {
    if ("data" in res) {
        if (res.data.success) {
            toast.success(res.data.message);
            if (navigate) navigate(url);
        } else {
            toast.error(res.data.message);
        }
    } else {
        const error = res.error as FetchBaseQueryError;
        const messageResponse=error.data as MessageResponse;
        toast.error(messageResponse.message);
    }
}

export const getLastMonths=()=>{
    const currentData=moment();

    currentData.date(1);

    const last6Months:string[]=[];
    const last12Months:string[]=[];
    
    for(let i=0;i<6;i++){
        const monthDate=currentData.clone().subtract(i,"months");
        const monthName=monthDate.format("MMMM");
        last6Months.unshift(monthName);
    }

    for(let i=0;i<12;i++){
        const monthDate=currentData.clone().subtract(i,"months");
        const monthName=monthDate.format("MMMM");
        last12Months.unshift(monthName);
    }

    return {last6Months,last12Months};
}