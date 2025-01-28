import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { Cart } from "../models/cart.js";


export const addCart = TryCatch(async (
    req,
    res,
    next
) => {
    const { userId } = req.query;
    const { productID, photo, name, price, quantity, stock } = req.body;
    if(!userId || !productID || !photo || !name || !price || !quantity || !stock){
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const cart = await Cart.findOne({ userId });
    if (cart) {
        const product = cart.cartItems.find(item => item.productID?.toString() === productID.toString());
        if (product) {
            product.quantity += quantity;
            product.stock = stock;
            product.price = price;
            product.photo = photo;
            product.name = name;
            await cart.save();
        } else {
            cart.cartItems.push({productID, photo, name, price, quantity, stock });
            await cart.save();
        }
    }
    else{
        const newCart = await Cart.create({
            userId,
            cartItems: [{productID, photo, name, price, quantity, stock }]
        });
    }
    res.status(200).json({
        status: true,
        message: "added to cart successfully"
    });
});

export const getCart = TryCatch(async (
    req,
    res,
    next
) => {
    const { userId } = req.query;
    if (!userId) {
        return next(new ErrorHandler("Please provide userId", 400));
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return next(new ErrorHandler("Cart is empty", 400));
    }
    res.status(200).json({
        status: true,
        cart
    });
});

export const deleteCartItem = TryCatch(async (
    req,
    res,
    next
) => {
    const { userId, productID } = req.query;
    if (!userId || !productID) {
        return next(new ErrorHandler("Please provide userId and productID", 400));
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return next(new ErrorHandler("Cart is empty", 400));
    }
    cart.cartItems.pull({ productID });
    await cart.save();
    res.status(200).json({
        status: true,
        message: "deleted from cart"
    });
});

export const deleteCart = TryCatch(async (
    req,
    res,
    next
) => {
    const { userId } = req.params;
    if (!userId) {
        return next(new ErrorHandler("Please provide userId", 400));
    }
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({
        status: true,
        message: "cart deleted"
    });
});