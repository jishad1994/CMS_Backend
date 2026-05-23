import { CookieOptions } from "express";
import { env } from "../config/env";

export const refreshTokenCookieName = "refreshToken";
export const accessTokenCookieName = "accessToken";

const isProduction = env.nodeEnv === "production";

export const refreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const accessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
};