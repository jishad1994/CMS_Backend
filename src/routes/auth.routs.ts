import express from "express";
import { authController } from "../dependencies/container.dependencies";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../dtos/auth.dto";

const authRoutes = express.Router();

authRoutes.post(`/login`, validate(loginSchema["body"], ["body"]), authController.login.bind(authController));
authRoutes.post(`/register`, validate(registerSchema, ["body"]), authController.register.bind(authController));
authRoutes.get(`/refresh`, authController.refresh.bind(authController));

export default authRoutes;
