export interface User {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
}

export interface Product {
    name: string;
    price: number;
    stock: number;
    category: string;
    photos: {
        public_id: string;
        url: string;
    }[];
    _id: string;
}

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
}
export type CartItem = {
    productID: string;
    photo: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}
export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
    shippingInfo: ShippingInfo;
    orderItems: OrderItem[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string;
    user: { name: string, _id: string };
    _id: string;
}
type ChangeAndCount = {
    revenue: number;
    products: number;
    users: number;
    orders: number;
}

type latestTransaction={
    _id:string;
    amount:number;
    discount:number;
    quantity:number;
    status:string;
}
export type Stats = {
    changePercent:ChangeAndCount;
    count:ChangeAndCount;
    chart:{
        order:number[];
        revenue:number[];
    };
    categoryCount:Record<string, number>[];
    ratio:{
        male:number;
        female:number;
    };
    latestTransaction: latestTransaction[];
}

export type Pie = {
    orderFullfillment : {
        processing: number;
        shipped: number;
        delivered: number;
    },
    productCategories:Record<string, number>[],
    stockAvailability: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: {
        netMargin: number;
        productionCost: number;
        markettingCost: number;
        burnt: number;
        discount: number;
    },
    adminCustomer: {
        customer: number;
        admin: number;
    },
    usersAgeGroup: {
        teen: number;
        adult: number;
        old: number;
    }
}

export type Bar={
    products:number[];
    users:number[];
    orders:number[];
}

export type Line={
    products:number[];
    revenue:number[];
    discount:number[];
    users:number[];
}