import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { RedisCacheService } from "./infrastructure/cacheService/redisCacheService";
import { MongoDatabaseConnection } from "./infrastructure/database/mongoDatabaseConnection";
import express, { Application } from "express";
import logger from "./utils/logger.util";
import { API_ENDPOINTS } from "./constants/routes.constants";
import authRoutes from "./routes/auth.routs";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware";
import articleRoutes from "./routes/article.routes";

const PORT = env.port || 3000;

const app: Application = express();

app.use(
    cors({
        origin: env.clientUrl,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

const databaseConnection = new MongoDatabaseConnection();
const cacherService = new RedisCacheService(env.redisUrl);

app.use(API_ENDPOINTS.AUTH, authRoutes);
app.use(API_ENDPOINTS.ARTICLE, articleRoutes);

app.use(errorMiddleware);

async function startApp() {
    try {
        await databaseConnection.connect();
        await cacherService.connect();

        app.listen(PORT, () => {
            logger.info(`server started running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
}

startApp();
