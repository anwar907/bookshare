import bcrypt from 'bcrypt';
import { prismaClient } from "../applications/database";
import { ResponseError } from "../error/response-error";
import { toUserResponse, type CreateUserRequest, type UserResponse } from "../model/user-model";
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
                deviceId: ""
            }
        });

        return toUserResponse(user)
    }

    
}