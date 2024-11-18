import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidatesCacheType, OrderItemType } from "../types/types.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "ShopVibe",
    }).then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.log(err);
    })
}

export const invalidatesCache = async ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
}: InvalidatesCacheType) => {
    if (product) {
        const productKeys: string[] = [
            "latestProducts",
            "categories",
            "adminProducts",
        ];
        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
        }
        if (typeof productId === "object") {
            productId.forEach((id) => {
                productKeys.push(`product-${id}`);
            });
        }
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys: string[] = [
            "adminOrders",
            `myorder-${userId}`,
            `order-${orderId}`,
        ];

        myCache.del(orderKeys);
    }
}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        product.stock -= order.quantity;
        await product.save();
    }
}

export const CalculatePercentage = (
    currentMonth: number,
    lastMonth: number
) => {
    if (lastMonth === 0) {
        return 100;
    }
    const percentage = ((currentMonth) / lastMonth) * 100;
    return Number(percentage.toFixed(2));
}

export const getInventories = async ({
    categories,
    productsCount,
}: { categories: string[];
    productsCount: number;
 }) => {
    const categoriesCountPromise = categories.map((category) => {
        return Product.countDocuments({ category });
    });

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    categories.forEach((category, index) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[index] / productsCount) * 100),
        });
    });
    return categoryCount;
}