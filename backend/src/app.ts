import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import dashboardRoutes from './routes/stats.routes.js';
import { connectDB } from './utils/features.js';
import { errorMiddleWare } from './middleware/error.js';
import NodeCache from 'node-cache';
import {config} from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from 'cors';

config(
    {
        path:"./.env"
    }
);

const MONGO_URI=process.env.MONGO_URI||"";
const StripeKey=process.env.STRIPE_KEY||"";
connectDB(MONGO_URI as string);
// export const stripe=new Stripe(StripeKey)
export const myCache = new NodeCache();

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