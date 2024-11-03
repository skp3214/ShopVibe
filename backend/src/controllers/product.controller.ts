import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidatesCache } from "../utils/features.js";
// import {faker} from "@faker-js/faker";
export const newProduct = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo) {
        return next(new ErrorHandler("Please upload a photo", 400));
    }
    if (!name || !category || !price || !stock) {
        rm(photo.path, () => {
            console.log("Photo deleted");
        });
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    const product = await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photo: photo?.path
    });

    await invalidatesCache({ product: true });

    return res.status(201).json({
        status: true,
        message: "Product created successfully",
        data: product
    });
});

export const getLatestProducts = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    let products;
    if (myCache.has("latestProducts")) {
        products = JSON.parse(myCache.get("latestProducts") as string);
    }
    else {
        products = await Product.find().sort({ createdAt: -1 }).limit(5);
        myCache.set("latestProducts", JSON.stringify(products));
    }
    return res.status(200).json({
        status: true,
        data: products
    });
});

export const getAllCategory = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    let categories;
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories") as string);
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        status: true,
        data: categories
    });
});

export const getAdminProducts = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    let products;
    if (myCache.has("adminProducts")) {
        products = JSON.parse(myCache.get("adminProducts") as string);
    }
    else {
        products = await Product.find();
        myCache.set("adminProducts", JSON.stringify(products));
    }
    return res.status(200).json({
        status: true,
        data: products
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    if (myCache.has(`product-${req.params.id}`)) {
        product = JSON.parse(myCache.get(`product-${req.params.id}`) as string);
    }
    else {
        product = await Product.findById(req.params.id);
        myCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    return res.status(200).json({
        status: true,
        data: product
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!name || !category || !price || !stock) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    product.name = name;
    product.category = category.toLowerCase();
    product.price = price;
    product.stock = stock;
    if (photo) {
        rm(product.photo, () => {
            console.log("Photo updated");
        });
        product.photo = photo.path;
    }
    await product.save();

    await invalidatesCache({ product: true });

    return res.status(200).json({
        status: true,
        message: "Product updated successfully",
        data: product
    });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    rm(product.photo, async() => {
        await invalidatesCache({ product: true });
    });
    return res.status(200).json({
        status: true,
        message: "Product deleted successfully"
    });
});

export const searchProduct = TryCatch(async (
    req: Request<{}, {}, {}, SearchRequestQuery>,
    res: Response,
    next: NextFunction) => {
    const { search, category, price, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCTS_LIMIT) || 8;
    const skip = (page - 1) * limit;
    const baseQuery: BaseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options: "i"
        };
    }

    if (category) {
        baseQuery.category = category;
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price)
        };
    }
    const productsPromise = Product.find(baseQuery).sort(sort ? { price: sort == "asc" ? 1 : -1 } : {}).limit(limit).skip(skip);

    const [products, filteredOnlyProducts] = await Promise.all([productsPromise, Product.find(baseQuery)]);

    const totalPages = Math.ceil(filteredOnlyProducts.length / limit);
    return res.status(200).json({
        status: true,
        data: products,
        totalPages,
    });
});

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\d11be897-d1bd-4395-b70c-39bd5fdf0ee2.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };
// generateRandomProducts(100);
