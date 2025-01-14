import { Request, Response, NextFunction } from "express";
export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: string;
    _id: string;
    dob: Date;
}

export interface NewProductRequestBody {
    name: string;
    category: string;
    price: number;
    stock:number;
    description: string;
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
    search?:string;
    category?:string;
    price?:string;
    sort?:string;
    page?:string;
}

export interface BaseQuery{
    name?:{
        $regex:string;
        $options:string;
    };
    price?:{
        $lte:number;
    };
    category?:string;
}

export type InvalidatesCacheType = {
    product?:boolean;
    order?:boolean;
    admin?:boolean;
    userId?:string;
    orderId?:string;
    productId?:string|string[];
};

export type OrderItemType={
    name:string;
    photo:string;
    price:number;
    quantity:number;
    productID:string;
}
export type shippingInfoType={
    address:string;
    city:string;
    state:string;
    country:string;
    pinCode:string;
}

export interface NewOrderRequestBody {
    shippingInfo:{};
    user:string;
    subtotal:number;
    tax:number;
    shippingCharges:number;
    discount:number;
    total:number;
    orderItems:OrderItemType[];
}