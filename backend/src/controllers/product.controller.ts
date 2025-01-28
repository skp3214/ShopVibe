import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { redis } from "../app.js";
import { deleteFromCloudinary, invalidatesCache, setProductRating, uploadToCloudinary } from "../utils/features.js";
import { User } from "../models/user.js";
import { Review } from "../models/review.js";
// import {faker} from "@faker-js/faker";

export const newProduct = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { name, category, price, stock, description } = req.body;
    const photos = req.files as Express.Multer.File[];
    if (!photos) {
        return next(new ErrorHandler("Please upload a photo", 400));
    }
    if (photos.length < 1) {
        return next(new ErrorHandler("Please upload atleast one photo", 400));
    }
    if (photos.length > 5) {
        return next(new ErrorHandler("Please upload only 5 photos", 400));
    }
    if (!name || !category || !price || !stock || !description) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const photosUrl = await uploadToCloudinary(photos);
    const product = await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photos: photosUrl,
        description
    });

    await invalidatesCache({ product: true, admin: true });

    return res.status(201).json({
        status: true,
        message: "Product created successfully",
    });
});

export const getLatestProducts = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    let products;
    products = await redis.get("latestProducts");
    if (products) {
        products = JSON.parse(products);
    }
    else {
        products = await Product.find().sort({ createdAt: -1 }).limit(5);
        redis.set("latestProducts", JSON.stringify(products));
    }
    return res.status(200).json({
        status: true,
        products: products
    });
});

export const getAllCategory = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    let categories;
    categories = await redis.get("categories");
    if (categories) {
        categories = JSON.parse(categories);
    }
    else {
        categories = await Product.distinct("category");
        redis.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        status: true,
        categories: categories
    });
});

export const getAdminProducts = TryCatch(async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
) => {
    let products;
    products = await redis.get("adminProducts");
    if (products) {
        products = JSON.parse(products);
    }
    else {
        products = await Product.find();
        redis.set("adminProducts", JSON.stringify(products));
    }
    return res.status(200).json({
        status: true,
        products: products
    });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    product = await redis.get(`product-${req.params.id}`);
    if (product) {
        product = JSON.parse(product);
    }
    else {
        product = await Product.findById(req.params.id);
        redis.set(`product-${req.params.id}`, JSON.stringify(product));
    }
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    return res.status(200).json({
        status: true,
        product: product
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const { name, category, price, stock, description } = req.body;
    const photos = req.files as Express.Multer.File[];
    if (!name || !category || !price || !stock) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }
    if (photos && photos.length > 0) {
        const photosUrl = await uploadToCloudinary(photos);
        const ids = product.photos.map(photo => photo.public_id);
        await deleteFromCloudinary(ids);
        product.photos = photosUrl.map(photo => ({
            public_id: photo.public_id,
            url: photo.url
        })) as any;
    }
    product.name = name;
    product.category = category.toLowerCase();
    product.price = price;
    product.stock = stock;
    product.description = description

    await product.save();

    await invalidatesCache({ product: true, admin: true, productId: String(product._id) });

    return res.status(200).json({
        status: true,
        message: "Product updated successfully",
    });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const ids = product.photos.map(photo => photo.public_id);
    await deleteFromCloudinary(ids);

    await invalidatesCache({ product: true, admin: true, productId: String(product._id) });

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
    const key = `search-${search}-category-${category}-price-${price}-sort-${sort}-page-${page}`;
    let products;
    let totalPages;
    const data = await redis.get(key);
    if (data) {
        const parsedData = JSON.parse(data);
        products = parsedData.products;
        totalPages = parsedData.totalPages;
    }
    else {

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

        const [productsFetched, filteredOnlyProducts] = await Promise.all([productsPromise, Product.find(baseQuery)]);

        totalPages = Math.ceil(filteredOnlyProducts.length / limit);

        products = productsFetched;
        await redis.setex(key, 60, JSON.stringify({ products, totalPages }));
    }
    return res.status(200).json({
        status: true,
        products: products,
        totalPages,
    });
});

export const NewReview = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.query.id);
    if (!user) {
        return next(new ErrorHandler("Please login first", 401));
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const { comment, rating } = req.body;
    if (!rating) {
        return next(new ErrorHandler("Please fill rating fields", 400));
    }
    if (rating < 1 || rating > 5) {
        return next(new ErrorHandler("Rating must be between 1 and 5", 400));
    }
    const alreadyReviewed = await Review.findOne({ productId: product._id, userId: user._id });
    if (alreadyReviewed) {
        const review = await Review.findByIdAndUpdate(alreadyReviewed._id, {
            comment,
            rating
        }, {
            new: true,
            runValidators: true
        });
    }
    else {
        await Review.create({
            comment,
            rating,
            productId: product._id,
            userId: user._id
        })
    }

    const { averageRating, reviewsCount } = await setProductRating(product._id);
    product.ratings = Math.floor(averageRating);
    product.numOfReviews = reviewsCount;
    await product.save();

    await invalidatesCache({ product: true, admin: true, review:true,productId: String(product._id) });

    return res.status(alreadyReviewed ? 200 : 201).json({
        status: true,
        message: alreadyReviewed ? "Review updated successfully" : "Review created successfully"
    });
});

export const DeleteReview = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.query.id);
    if (!user) {
        return next(new ErrorHandler("Please login first", 401));
    }
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorHandler("Review not found", 404));
    }
    const isAuthenticUser = review.userId.toString() === user._id.toString();
    if (!isAuthenticUser) {
        return next(new ErrorHandler("You are not authorized to delete this review", 401));
    }
    await review.deleteOne();

    const product = await Product.findById(review.productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const { averageRating, reviewsCount } = await setProductRating(product._id);
    product.ratings = Math.floor(averageRating);
    product.numOfReviews = reviewsCount;
    await product.save();

    await invalidatesCache({ product: true, admin: true, review:true, productId: String(review.productId) });

    return res.status(200).json({
        status: true,
        message: "Review Deleted Successfully"
    });
});

export const getSingleProductAllReviews = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    let reviews;
    reviews = await redis.get(`${req.params.id}-reviews`);
    if (reviews) {
        reviews = JSON.parse(reviews);
    }
    else {
        reviews = await Review.find({
            productId: req.params.id
        }).populate("userId", "name photo")
            .sort({ updatedAt: -1 });
        await redis.setex(`${req.params.id}-reviews`, 60, JSON.stringify(reviews));
    }
    return res.status(200).json({
        status: true,
        reviews
    });
});
