import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidatesCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(async (
    req: Request<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !shippingCharges || !discount || !total) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const order = await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
    });

    await reduceStock(orderItems);

    invalidatesCache({ product: true, order: true, admin: true });

    res.status(200).json({
        success: true,
        message: "Order placed successfully",
        order
    });

});

export const MyOrders = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { id } = req.query;
    let orders = [];
    if (myCache.has(`order-${id}`)) {
        orders = JSON.parse(myCache.get(`order-${id}`) as string);
    }
    else {
        orders = await Order.find({ user: id });
        myCache.set(`order-${id}`, JSON.stringify(orders));
    }
    res.status(200).json({
        success: true,
        orders
    });
});

export const AdminOrders = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const key = "adminOrders";
    let orders = [];
    if (myCache.has(key)) {
        orders = JSON.parse(myCache.get(key) as string);
    }
    else {
        orders = await Order.find().populate("user","name email");
        myCache.set(key, JSON.stringify(orders));
    }
    res.status(200).json({
        success: true,
        orders
    });
});

export const getSingleOrder=TryCatch(async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const {id}=req.params;
    const key=`singleorder-${id}`;
    let order;
    if(myCache.has(key)){
        order=JSON.parse(myCache.get(key) as string);
    }
    else{
        order=await Order.findById(id).populate("user","name email");
        if(!order){
            return next(new ErrorHandler("Order not found",404));
        }
        myCache.set(key,JSON.stringify(order));
    }
    res.status(200).json({
        success:true,
        order
    });
});
