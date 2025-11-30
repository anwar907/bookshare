import express from 'express';
import { errorMidleware } from '../middleware/error-middleware';
import { publicRouter } from '../router/public-api';

export const web = express();
web.use(express.json());
web.use(publicRouter);
web.use(errorMidleware);
