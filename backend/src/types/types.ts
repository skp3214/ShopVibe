import { Request, Response, NextFunction } from "express";
export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: string;
    _id: string;
    dob: Date;
}

export type ControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;