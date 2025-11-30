import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaClient } from "../applications/database";
import { ResponseError } from "../error/response-error";
import { toUserResponse, type CreateUserRequest, type UserResponse } from "../model/user-model";
import { getTokenExpiration } from '../utils/token-utils';
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";

export class UserServices {

    static async userRegister(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate<CreateUserRequest>(UserValidation.REGISTER, request);

    
        const customerUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: registerRequest.email
            }
        });

        if(customerUserWithSameEmail != 0){
            throw new ResponseError(400, "Email already exists");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: {
                email: registerRequest.email,
                name: registerRequest.name,
                password: registerRequest.password,
                role: registerRequest.role,
            }
        });

        return toUserResponse(user)
    }

    static async userLogin(request: CreateUserRequest): Promise<string>{
        const validateRequest = Validation.validate<CreateUserRequest>(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findFirst({
            where: {
                email: validateRequest.email
            }
        });

        if(!user){
            throw new ResponseError(400, "Email not found");
        }

        const checkPassowrd = await bcrypt.compare(validateRequest.password, user.password);
        if(!checkPassowrd){
            throw new ResponseError(400, "Password wrong");
        }

        await prismaClient.userDevice.updateMany({
            where: {
                userId: user.id,
                is_active: true
            },
            data: {
                is_active: false,
                updated_at: new Date()
            }
        })

        const token = jwt.sign({
            id: user.id,
            name: user.name,
            role: user.role,
        }, process.env.SCRET_KEY as string, {
            expiresIn: "1h"
        });


        await prismaClient.userDevice.create({
            data: {
                userId: user.id,
                access_token: token,
                deviceId: validateRequest.deviceId,
                created_at: new Date(),
                updated_at: new Date(),
                expire_at: getTokenExpiration(1),
                is_active: true
            }
        })

        return token;
        
    }
}