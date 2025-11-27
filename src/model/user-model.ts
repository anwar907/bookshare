import type { Admin, Customer } from "@prisma/client";

export type UserResponse = {
    name: string;
    email: string;
    role: string;
    token?: string
}

export type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
    role: string;
}

export function toUserResponse(user: Admin | Customer): UserResponse {
    return {
        name: user.name,
        email: user.email,
        role: user.role,
    }
}