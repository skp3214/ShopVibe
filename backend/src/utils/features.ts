import mongoose, { Document } from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { InvalidatesCacheType, OrderItemType } from "../types/types.js";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
export const connectDB = (uri: string) => {
    mongoose.connect(uri, {
        dbName: "ShopVibeUpgrade",
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
    if (admin) {
        const adminKeys = [
            "dashboardStat",
            "admin-pie-charts",
            "barCharts",
            "lineCharts",
        ];
        myCache.del(adminKeys);
    }

}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];

        const product = await Product.findById(order.productID);
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
        return currentMonth * 100;
    }
    const percentage = ((currentMonth) / lastMonth) * 100;
    return Number(percentage.toFixed(0));
}

export const getInventories = async ({
    categories,
    productsCount,
}: {
    categories: string[];
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
interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
}
type FuncProps = {
    length: number;
    docArr: MyDocument[];
    property?: "discount" | "total";
}
export const getChartData = ({ length, docArr, property }: FuncProps) => {
    const data: number[] = new Array(length).fill(0);
    const today = new Date();
    docArr.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property]! : 1;
        }
    });
    return data;
}
const getBase64 = (file: Express.Multer.File) => {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}
export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
    const promises = files.map(async (file) => {
        return new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload(getBase64(file), (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result!);
            });
        });
    });
    const result = await Promise.all(promises);
    return result.map((i) => ({
        public_id: i.public_id,
        url: i.secure_url,
    }));
}

export const deleteFromCloudinary = async (public_id: string[]) => {
    const promises = public_id.map((id) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(id, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    });
    await Promise.all(promises);
}