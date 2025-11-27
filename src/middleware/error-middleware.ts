import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";


export const errorMidleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    
    if(error instanceof ZodError){
         res.status(400).json({
            status: "error",
            message: error.message
        });
    } else if(error instanceof ResponseError){
         res.status(error.status).json({
            status: "error",
            message: error.message
        });
    } else { 
        res.status(500).json({
            errors: error.message
        })
    }
}