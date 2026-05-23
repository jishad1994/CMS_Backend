import dotenv from "dotenv";
dotenv.config();

const requiredVariables = [
    "PORT",
    "MONGO_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_TOKEN_EXPIRES_IN",
    "JWT_ACCESS_TOKEN_EXPIRES_IN",
    "CLIENT_URL",
] as const;

requiredVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});
export const env = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV ?? "development",
    mongoUri: process.env.MONGO_URI as string,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
    jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
    jwtRefreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
    clientUrl: process.env.CLIENT_URL as string,
    redisUrl: process.env.REDIS_URL as string,
};
