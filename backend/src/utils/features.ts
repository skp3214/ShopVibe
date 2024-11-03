import mongoose from "mongoose"
import { InvalidatesCacheType } from "../types/types.js";
import { Product } from "../models/product.js";
import { myCache } from "../app.js";

export const connectDB = () => {
    mongoose.connect("mongodb+srv://skprajapati3214:Sachin3214@backend-cluster.qfpxr0l.mongodb.net/?retryWrites=true&w=majority", {
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