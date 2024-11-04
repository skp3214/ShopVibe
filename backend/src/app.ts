import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import { connectDB } from './utils/features.js';
import { errorMiddleWare } from './middleware/error.js';
import NodeCache from 'node-cache';
import {config} from 'dotenv';
import morgan from 'morgan';

config(
    {
        path:"./.env"
    }
);

const MONGO_URI=process.env.MONGO_URI||"";
connectDB(MONGO_URI as string);
export const myCache = new NodeCache();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);  
app.use("/api/v1/order", orderRoutes);


app.get('/', (req, res) => { 
    res.send('Hello World!'); 
});
app.use('/uploads', express.static('uploads'));

app.use(errorMiddleWare);

const PORT=process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is running on port ',`${PORT}`);
});