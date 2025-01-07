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

    await invalidatesCache({ product: true, order: true, admin: true, userId: user, productId:orderItems.map(item=>item.productId) });

    res.status(200).json({
        status: true,
        message: "Order placed successfully",
    });

});

export const MyOrders = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const { id } = req.query;
    let orders = [];
    if (myCache.has(`myorder-${id}`)) {
        orders = JSON.parse(myCache.get(`myorder-${id}`) as string);
    }
    else {
        orders = await Order.find({ user: id });
        myCache.set(`myorder-${id}`, JSON.stringify(orders));
    }
    res.status(200).json({
        status: true,
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
        orders = await Order.find().populate("user", "name email");
        myCache.set(key, JSON.stringify(orders));
    }
    res.status(200).json({
        status: true,
        orders
    });
});

export const getSingleOrder = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;
    if (myCache.has(key)) {
        order = JSON.parse(myCache.get(key) as string);
    }
    else {
        order = await Order.findById(id).populate("user", "name email");
        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }
        myCache.set(key, JSON.stringify(order));
    }
    res.status(200).json({
        status: true,
        orders:order
    });
});

export const processOrder = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    let order = await Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
    }
    await order.save();
    await invalidatesCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
    res.status(200).json({
        status: true,
        message: "Order processed successfully"
    });
});

export const deleteOrder = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }
    await order.deleteOne();
    await invalidatesCache({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
    res.status(200).json({
        status: true,
        message: "Order deleted successfully"
    });
});