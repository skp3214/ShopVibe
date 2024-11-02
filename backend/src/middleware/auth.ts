import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import { User } from "../models/user.js";

export const adminOnly = TryCatch(async(req:Request,res:Response,next:NextFunction)=>{
    const {id}=req.query;
    if(!id){
        return next(new ErrorHandler("Please Login",404));
    }
    const user=await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    if(user.role!=="admin"){
        return next(new ErrorHandler("You are not authorized to access this route",401));
    }
    next();
});