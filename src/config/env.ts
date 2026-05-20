import dotenv from "dotenv";
dotenv.config();

const requiredVariables = ["PORT", "MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN", "CLIENT_URL"] as const;

requiredVariables.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});
export const env = {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV ?? "development",
    mongoUri: process.env.MONGO_URI as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    clientUrl: process.env.CLIENT_URL as string,
};
