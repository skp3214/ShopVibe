import { TryCatch } from "../middleware/error.js";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../models/coupon.js";
import { stripe } from "../app.js";

export const createPaymentIntent = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { amount } = req.body;
    if (!amount) {
        res.status(400);
        return next(new ErrorHandler("Please Enter Amount", 400));
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
    });
    res.status(201).json({
        success: true,
        client_secret: paymentIntent.client_secret,
    });
});

export const newCoupon = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { couponCode, amount } = req.body;
    if (!couponCode || !amount) {
        res.status(400);
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const coupon = await Coupon.create({
        couponCode,
        amount
    });
    res.status(201).json({
        success: true,
        message: "Coupon created successfully",
    });
});

export const applyDiscount = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const couponCode = req.query.couponCode as string;
    if (!couponCode) {
        res.status(400);
        return next(new ErrorHandler("Please provide a coupon code", 400));
    }
    const coupon = await Coupon.findOne({ couponCode });
    if (!coupon) {
        res.status(404);
        return next(new ErrorHandler("Invalid Coupon Code", 404));
    }

    res.status(200).json({
        success: true,
        discount: coupon.amount,
    });
});

export const allCoupons = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const coupons = await Coupon.find();
    res.status(200).json({
        success: true,
        coupons,
    });
});

export const deleteCoupons = TryCatch(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    if (!id) {
        res.status(400);
        return next(new ErrorHandler("Please provide a coupon id", 400));
    }
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
        res.status(404);
        return next(new ErrorHandler("Coupon not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
    });
});

export const updateCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { couponCode, amount } = req.body;

    const coupon = await Coupon.findById(id);

    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

    if (couponCode) coupon.couponCode = couponCode;
    if (amount) coupon.amount = Number(amount);

    const resp = await coupon.save();
    console.log(resp);
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.couponCode} Updated Successfully`,
    });
});

export const getCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

    return res.status(200).json({
        success: true,
        coupons: coupon,
    });
});