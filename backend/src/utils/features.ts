import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidatesCacheType, OrderItemType } from "../types/types.js";

export const connectDB = (uri:string) => {
    mongoose.connect(uri, {
        dbName: "ShopVibe",
    }).then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.log(err);
    })
}

export const invalidatesCache = async({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
}:InvalidatesCacheType) => {
    if(product){
        const productKeys:string[] = [
            "latestProducts",
            "categories",
            "adminProducts",
        ];
        if(typeof productId === "string"){
            productKeys.push(`product-${productId}`);
        }
        if(typeof productId === "object"){
            productId.forEach((id) => {
                productKeys.push(`product-${id}`);
            });
        }
        myCache.del(productKeys);
    }
    if(order){
        const orderKeys:string[]=[
            "adminOrders",
            `myorder-${userId}`,
            `order-${orderId}`,
        ];
        
        myCache.del(orderKeys);
    }
}

export const reduceStock=async(orderItems:OrderItemType[])=>{
    for(let i=0;i<orderItems.length;i++){
        const order=orderItems[i];
        const product=await Product.findById(order.productId);
        if(!product){
            throw new Error("Product not found");
        }
        product.stock-=order.quantity;
        await product.save();
    }
}