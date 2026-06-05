import { NextFunction, Request, Response } from "express";
import { IAuthService } from "../services/auth/auth.service.interface";
import { ApiResponse } from "../utils/apiResponse.util";
import { HTTP_MESSAGES } from "../constants/http.messages.contants";
import {
    accessTokenCookieName,
    accessTokenCookieOptions,
    refreshTokenCookieName,
    refreshTokenCookieOptions,
} from "../utils/cookies.util";
import { AppError } from "../errors/app.error";

export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw new AppError(HTTP_MESSAGES.MISSING_TOKEN, 401);
            }

            const result = await this.authService.refresh(refreshToken);

            res.cookie(refreshTokenCookieName, result.refreshToken, refreshTokenCookieOptions);

            res.cookie(accessTokenCookieName, result.accessToken, accessTokenCookieOptions);

            return ApiResponse.success(res, HTTP_MESSAGES.TOKEN_REFRESH_SUCCESSFULL, { user: result.user });
        } catch (error) {
            next(error);
        }
    };

    register = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const result = await this.authService.register(req.body);

            const accessToken = result.accessToken;

            const refreshToken = result.refreshToken;

            res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);

            res.cookie(accessTokenCookieName, accessToken, accessTokenCookieOptions);

            return ApiResponse.success(res, HTTP_MESSAGES.CREATED, { user: result.user });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const result = await this.authService.login(req.body);

            const accessToken = result.accessToken;

            const refreshToken = result.refreshToken;

            res.cookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions);

            res.cookie(accessTokenCookieName, accessToken, accessTokenCookieOptions);

            return ApiResponse.success(res, HTTP_MESSAGES.LOGIN_SUCCESSFULL, { user: result.user });
        } catch (error) {
            next(error);
        }
    };

    
    logout = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
         try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            throw new AppError(HTTP_MESSAGES.MISSING_TOKEN, 401);
        }

        await this.authService.logout(refreshToken);

        res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions);
        res.clearCookie(accessTokenCookieName, accessTokenCookieOptions);

        return ApiResponse.success(res, HTTP_MESSAGES.LOGOUT_SUCCESSFULL, null);
    } catch (error) {
        next(error);
    }
    };
    
}
