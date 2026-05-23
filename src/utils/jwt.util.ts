import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { StringValue } from "ms";
export interface JwtPayload {
    userId: string;
    email: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload as JwtPayload, env.jwtAccessSecret, {
        expiresIn: env.jwtAccessTokenExpiresIn as StringValue,
    });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload as JwtPayload, env.jwtRefreshSecret, {
        expiresIn: env.jwtRefreshTokenExpiresIn as StringValue,
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
};
