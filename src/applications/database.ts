import { PrismaClient } from '@prisma/client';
import { logger } from './logging';

export const prismaClient = new PrismaClient();