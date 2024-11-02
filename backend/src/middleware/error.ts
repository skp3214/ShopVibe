import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleWare=(err:ErrorHandler,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode=err.statusCode||500;
    err.message=err.message||"Internal Server Error";
    res.status(err.statusCode).json({
        status:false,
        message:err.message
    })
};

export const TryCatch=(fn:ControllerType)=>(req:Request,res:Response,next:NextFunction)=>{
    return Promise.resolve(fn(req,res,next)).catch(next);
};