import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import dashboardRoutes from './routes/stats.routes.js';
import { connectDB, connectRedis } from './utils/features.js';
import { errorMiddleWare } from './middleware/error.js';
import {config} from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
config(
    {
        path:"./.env"
    }
);

const MONGO_URI=process.env.MONGO_URI||"";
const StripeKey=process.env.STRIPE_KEY||"";
connectDB(MONGO_URI as string);
export const redis=connectRedis(process.env.REDIS_URL as string);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export const stripe=new Stripe(StripeKey)

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);  
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.get('/', (req, res) => { 
    res.send('Welcome to shopvibe api!'); 
});
app.use('/uploads', express.static('uploads'));

app.use(errorMiddleWare);

const PORT=process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is running on port ',`${PORT}`);
});