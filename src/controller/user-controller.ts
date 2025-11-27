import type { NextFunction, Request, Response } from "express";
import type { CreateUserRequest } from "../model/user-model";
import { UserServices } from "../service/user-services";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserServices.adminRegister(request);

            res.status(201).json({
                data: response
            })
        } catch (error) { 
            next(error);
        }
    }
}