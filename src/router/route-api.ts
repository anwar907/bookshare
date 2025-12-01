import express from "express";
import { UserController } from "../controller/user-controller";

export const publicRouter = express.Router();
publicRouter.post("/api/user/register", UserController.register);
publicRouter.post("/api/user/login", UserController.login);

