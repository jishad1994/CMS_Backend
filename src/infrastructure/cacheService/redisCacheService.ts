import { RedisClientType, createClient } from "redis";
import { ICacheService } from "./ICacheService";
import logger from "../../utils/logger.util";
import { AppError } from "../../errors/app.error";
import { HTTP_STATUS } from "../../constants/http.messages.contants";

export class RedisCacheService implements ICacheService {
    private client: RedisClientType;

    constructor(private url: string) {
        this.client = createClient({ url: this.url });
        this.client.on("error", (error) => logger.error("redis Error:", error));
    }
    //static connect method
    async connect(): Promise<void> {
        try {
            await this.client.connect();
            logger.info("redis cache service connected");
        } catch (error) {
            logger.info("redis connection failed", error);
            throw new AppError("redis connection failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    //get method
    async get<T>(key: string): Promise<T | null> {
        const value = await this.client.get(key);
        return value ? JSON.parse(value as string) : null;
    }

    //set method
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean | void> {
        const data = JSON.stringify(value);

        if (ttlSeconds) {
            await this.client.setEx(key, ttlSeconds, data);
            return true;
        } else {
            await this.client.set(key, data);
            return true;
        }
    }

    //delete method
    async delete(key: string): Promise<void | boolean> {
        await this.client.del(key);
        return true;
    }
}
