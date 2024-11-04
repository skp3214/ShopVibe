import mongoose from "mongoose"
import { InvalidatesCacheType, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";

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
    admin
}:InvalidatesCacheType) => {
    if(product){
        const productKeys:string[] = [
            "latestProducts",
            "categories",
            "adminProducts",
        ];
        const productsId=await Product.find().select("_id");
        productsId.forEach((product)=>{
            productKeys.push(`product-${product._id}`);
        });
        myCache.del(productKeys);
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