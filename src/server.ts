import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { RedisCacheService } from "./infrastructure/cacheService/redisCacheService";
import { MongoDatabaseConnection } from "./infrastructure/database/mongoDatabaseConnection";
import express, { Application } from "express";

const app: Application = express();
app.use(cookieParser());

const databaseConnection = new MongoDatabaseConnection();
const cacherService = new RedisCacheService(env.redisUrl);

const startApp = async () => {
    await databaseConnection.connect();
    await cacherService.connect();
};

startApp();
