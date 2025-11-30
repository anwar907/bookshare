import { ZodType, z } from "zod";
import type { CreateUserRequest } from "../model/user-model";

export class UserValidation {
    static readonly REGISTER: ZodType<CreateUserRequest> = z.object({
        name: z.string().min(1).max(100),
        email: z.string().min(1).max(100),
        password: z.string().min(1).max(100),
        role: z.enum(['ADMIN', 'CUSTOMER']),
        // createdAt: z.date(),
        // updatedAt: z.date(),
    });
}