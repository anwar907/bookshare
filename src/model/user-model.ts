import type { Role, User } from "@prisma/client";

export type UserResponse = {
    id: string;
    name: string;
    email: string;
    role: string;
    token?: string;
    createdAt: Date;
}

export type CreateUserRequest = {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export function toUserResponse(user: User): UserResponse {
    return {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
        createdAt: user.createdAt,
    }
}