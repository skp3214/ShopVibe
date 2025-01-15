import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middleware/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { myCache } from "../app.js";
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
    console.log(photos);
    if (!photos) {
        return next(new ErrorHandler("Please upload a photo", 400));
    }
    if(photos.length<1){
        return next(new ErrorHandler("Please upload atleast one photo", 400));
    }
    if(photos.length>5){
        return next(new ErrorHandler("Please upload only 5 photos", 400));
    }
    if (!name || !category || !price || !stock || !description) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const photosUrl=await uploadToCloudinary(photos);
    const product = await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photos:photosUrl,
        description
    });

    await invalidatesCache({ product: true,admin:true });

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
    if (myCache.has("latestProducts")) {
        products = JSON.parse(myCache.get("latestProducts") as string);
    }
    else {
        products = await Product.find().sort({ createdAt: -1 }).limit(5);
        myCache.set("latestProducts", JSON.stringify(products));
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
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories") as string);
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
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
    if (myCache.has("adminProducts")) {
        products = JSON.parse(myCache.get("adminProducts") as string);
    }
    else {
        products = await Product.find();
        myCache.set("adminProducts", JSON.stringify(products));
    }
    return res.status(200).json({
        status: true,
        products: products
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
    if(photos && photos.length>0){
        const photosUrl=await uploadToCloudinary(photos);
        const ids=product.photos.map(photo=>photo.public_id);
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

    await invalidatesCache({ product: true, admin:true, productId: String(product._id) });

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
    const ids=product.photos.map(photo=>photo.public_id);
    await deleteFromCloudinary(ids);

    await invalidatesCache({ product: true, admin:true, productId: String(product._id)});

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
        products: products,
        totalPages,
    });
});

export const NewReview = TryCatch(async (req, res, next) => {
    const user=await User.findById(req.query.id);
    if(!user){
        return next(new ErrorHandler("Please login first",401));
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    const {comment,rating}=req.body;
    if(!rating){
        return next(new ErrorHandler("Please fill rating fields",400));
    }
    if(rating<1 || rating>5){
        return next(new ErrorHandler("Rating must be between 1 and 5",400));
    }
    const alreadyReviewed=await Review.findOne({productId:product._id,userId:user._id});
    if(alreadyReviewed){
        const review=await Review.findByIdAndUpdate(alreadyReviewed._id,{
            comment,
            rating
        },{
            new:true,
            runValidators:true
        });
    }
    else{
        await Review.create({
            comment,
            rating,
            productId:product._id,
            userId:user._id
        })
    }

    const {averageRating,reviewsCount}=await setProductRating(product._id);
    product.ratings=Math.floor(averageRating);
    product.numOfReviews=reviewsCount;
    await product.save();

    await invalidatesCache({ product: true, admin:true, productId: String(product._id)});

    return res.status(alreadyReviewed?200:201).json({
        status: true,
        message: alreadyReviewed?"Review updated successfully":"Review created successfully"
    });
});
export const DeleteReview = TryCatch(async (req, res, next) => {
    const user=await User.findById(req.query.id);
    if(!user){
        return next(new ErrorHandler("Please login first",401));
    }
    const review=await Review.findById(req.params.id);
    if(!review){
        return next(new ErrorHandler("Review not found",404));
    }
    const isAuthenticUser=review.userId.toString()===user._id.toString();
    if(!isAuthenticUser){
        return next(new ErrorHandler("You are not authorized to delete this review",401));
    }
    await review.deleteOne();

    const product = await Product.findById(review.productId);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const {averageRating,reviewsCount}=await setProductRating(product._id);
    product.ratings=Math.floor(averageRating);
    product.numOfReviews=reviewsCount;
    await product.save();

    await invalidatesCache({ product: true, admin:true, productId: String(review.productId)});

    return res.status(200).json({
        status: true,
        message: "Review Deleted Successfully"
    });
});

export const getSingleProductAllReviews = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find({
        productId: req.params.id
    }).populate("userId", "name photo")
    .sort({ updatedAt: -1 });
    ;

    return res.status(200).json({
        status: true,
        reviews
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
