import mongoose from "mongoose";
import { Product } from "./product.js";

const schema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:[true,"Please enter address"],
        },
        city:{
            type:String,
            required:[true,"Please enter city"],
        },
        state:{
            type:String,
            required:[true,"Please enter state"],
        },
        country:{
            type:String,
            required:[true,"Please enter country"],
        },
        pinCode:{
            type:String,
            required:[true,"Please enter postal code"],
        }
    },
    user:{
        type:String,
        required:true,
        ref:"User",
    },
    subtotal:{
        type:Number,
        required:true,
    },
    tax:{
        type:Number,
        required:true,
    },
    shippingCharges:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing",
    },
    orderItems:[
        {
            name:String,
            photo:String,
            price:Number,
            quantity:Number,
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
            }
        }
    ]
},{timestamps:true});

export const Order=mongoose.model("Order",schema);