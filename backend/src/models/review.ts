import mongoose from "mongoose";

const schema=new mongoose.Schema({
    comment:{
        type:String,
    },
    rating:{
        type:Number,
        required:[true,"Please give rating"],
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
    },
    userId:{
        type:String,
        ref:"User",
        required:true,
    }
});

export const Review=mongoose.model("Review",schema);