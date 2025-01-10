import { CartItem, Order, Pie, Product, ShippingInfo, Stats, User } from "./types";

export type MessageResponse = {
    status: boolean;
    message: string;
}

export type UserResponse = {
    status: boolean;
    user: User;
}

export type AllUsersResponse = {
    status: boolean;
    users: User[];
}

export type AllProductResponse = {
    status: boolean;
    products: Product[];
}

export type CategoriesResponse = {
    status: boolean;
    categories: string[];
}

export type SearchedProductsResponse = AllProductResponse & {
    totalPages: number;
}

export type AllOrderResponse = {
    status: boolean;
    orders: Order[];
}

export type OrderDetailsResponse = {
    status: boolean;
    orders: Order;
}

export type ProductResponse = {
    status: boolean;
    product: Product;
}

export type StatsResponse={
    success:boolean;
    stats:Stats;
}

export type PieResponse={
    success:boolean;
    charts:Pie;
}
export type SearchedProductRequest = {
    price: number;
    page: number;
    sort: string;
    category: string;
    search: string;
}

export type NewProductRequestBody = {
    id: string;
    formData: FormData;
}

export type UpdateProductRequestBody = {
    userId: string;
    productId: string;
    formData: FormData;
}

export type DeleteProductRequestBody = {
    userId: string;
    productId: string;
}

export type CustomError = {
    status: number;
    data: {
        message: string;
        status: boolean;
    }
}

export type NewOrderRequest = {
    shippingInfo: ShippingInfo;
    orderItems: Array<CartItem>;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    user: string;
}

export type UpdateOrderRequest = {
    userId: string;
    orderId: string;
}

export type DeleteUserRequest = {
    userId: string;
    adminId: string;
}