import bcrypt from 'bcrypt';
import { prismaClient } from "../applications/database";
import { ResponseError } from "../error/response-error";
import { toUserResponse, type CreateUserRequest, type UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";

export class UserServices {

    static async customerRegister(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate<CreateUserRequest>(UserValidation.REGISTER, request);

    
        const customerUserWithSameEmail = await prismaClient.customer.count({
            where: {
                email: registerRequest.email,
            }
        });

        if(customerUserWithSameEmail != 0){
            throw new ResponseError(400, "Email already exists");
        }

        if(registerRequest.role != "customer"){
            throw new ResponseError(400, "Role must be customer");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.customer.create({
            data: registerRequest
        });

        return toUserResponse(user)
    }

    static async adminRegister(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate<CreateUserRequest>(UserValidation.REGISTER, request);

         const adminUserWithSameEmail = await prismaClient.admin.count({
            where: {
                email: registerRequest.email
            }
        });

        if(adminUserWithSameEmail != 0){
            throw new ResponseError(400, "Email already exists");
        }

        if(registerRequest.role != "admin"){
            throw new ResponseError(400, "Role must be admin");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.admin.create({
            data: registerRequest
        });

        return toUserResponse(user)
    }
}