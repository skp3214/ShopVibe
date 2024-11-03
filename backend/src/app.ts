import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import { connectDB } from './utils/features.js';
import { errorMiddleWare } from './middleware/error.js';
import NodeCache from 'node-cache';
connectDB();
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);  
app.get('/', (req, res) => { 
    res.send('Hello World!'); 
});
app.use('/uploads', express.static('uploads'));
app.use(errorMiddleWare);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});