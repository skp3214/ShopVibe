import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/user.routes.js';
import { connectDB } from './utils/features.js';
import { errorMiddleWare } from './middleware/error.js';
connectDB();
const app = express();
app.use(express.json());
app.use("/api/v1/user", userRoutes);
app.get('/', (req, res) => { 
    res.send('Hello World!'); 
});
app.use(errorMiddleWare);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});