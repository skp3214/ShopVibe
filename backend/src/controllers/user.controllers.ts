import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middleware/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
    async (
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {

        const { name, email, photo, gender, role, _id, dob } = req.body;

        let user = await User.findById(_id);

        if (user) {
            return res.status(200).json({
                status: true,
                message: `Welcome back, ${user.name}`
            });
        }
        if (!_id || !name || !email || !photo || !gender || !role || !dob) {
            return next(new ErrorHandler("Please fill all the fields", 400));
        }

        user = await User.create({ name, email, photo, gender, role, _id, dob: new Date(dob) });

        return res.status(201).json({
            status: true,
            message: `Welcome, ${user.name}`
        });
    }
);

export const getAllUsers = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await User.find();

        return res.status(200).json({
            status: true,
            data: users
        });
    }
);

export const getUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        return res.status(200).json({
            status: true,
            data: user
        });
    }
)

export const deleteUser = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        return res.status(200).json({
            status: true,
            message: "User deleted successfully"
        });
    }
)
