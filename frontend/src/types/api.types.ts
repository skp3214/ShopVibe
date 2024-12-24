import { Product, User } from "./types";

export type MessageResponse={
    status:boolean;
    message:string;
}

export type UserResponse={
    status:boolean;
    user:User;
}

export type AllProductResponse={
    status:boolean;
    products:Product[];
}

export type CategoriesResponse={
    status:boolean;
    categories:string[];
}

export type SearchedProductsResponse=AllProductResponse & {
    totalPages:number;
}

export type SearchedProductRequest={
    price:number;
    page:number;
    sort:string;
    category:string;
    search:string;
}

export type ProductResponse={
    status:boolean;
    product:Product;
}

export type NewProductRequestBody={
    id:string;
    formData:FormData;
}

export type UpdateProductRequestBody={
    userId:string;
    productId:string;
    formData:FormData;
}
export type DeleteProductRequestBody={
    userId:string;
    productId:string;
}
export type CustomError={
    status:number;
    data:{
        message:string;
        status:boolean;
    }
}