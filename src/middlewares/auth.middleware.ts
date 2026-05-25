import { Request, Response, NextFunction } from "express";
import { AuthCookiesSchema } from "../dtos/auth.dto.js";
import { AppError } from "../errors/app.error.js";
import { HTTP_MESSAGES } from "../constants/http.messages.contants.js";
import { JwtPayload, verifyAccessToken } from "../utils/jwt.util.js";
import logger from "../utils/logger.util.js";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    const result = AuthCookiesSchema.safeParse(req.cookies);

    if (!result.success) {
        return next(new AppError(HTTP_MESSAGES.MISSING_TOKEN, 401));
    }

    const { accessToken } = result.data;

    try {
        const payload: JwtPayload = verifyAccessToken(accessToken);

        req.user = { userId: payload.userId,name:payload.name, email: payload.email };
        next();
    } catch (error) {
        logger.error("Unexpected Auth Error:", error);
        return next(new AppError(HTTP_MESSAGES.UNAUTHORIZED, 401));
    }
}
