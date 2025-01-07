export interface User{
    name:string;
    email:string;
    photo:string;
    gender:string;
    role:string;
    dob:string;
    _id:string;
}

export interface Product{
    name:string;
    price:number;
    stock:number;
    category:string;
    photo:string;
    _id:string;
}

export type ShippingInfo={
    address:string;
    city:string;
    state:string;
    pinCode:string;
    country:string;
}
export type CartItem={
    productID:string;
    photo:string;
    name:string;
    price:number;
    quantity:number;
    stock:number;
}
export type OrderItem=Omit<CartItem,"stock"> & {_id:string};

export type Order={
    shippingInfo:ShippingInfo;
    orderItems:OrderItem[];
    subtotal:number;
    tax:number;
    shippingCharges:number;
    discount:number;
    total:number;
    status:string;
    user:{name:string,_id:string};
    _id:string;
}