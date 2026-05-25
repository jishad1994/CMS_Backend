import { env } from "../config/env";
import { ArticleController } from "../controllers/article.controller";
import { AuthController } from "../controllers/auth.controller";
import { RedisCacheService } from "../infrastructure/cacheService/redisCacheService";
import { ArticleModel } from "../models/article.model";
import { UserModel } from "../models/user.model";
import { ArticleRepository } from "../repositories/implementations/article.repository";
import { UserRepository } from "../repositories/implementations/user.repository";
import { ArticleService } from "../services/article/article.service";
import { AuthService } from "../services/auth/auth.service";

export const articleRepository = new ArticleRepository(ArticleModel);
export const articleService = new ArticleService(articleRepository);
export const articleController = new ArticleController(articleService);

const cacheService = new RedisCacheService(env.redisUrl);

export const userRepository = new UserRepository(UserModel);
export const authService = new AuthService(userRepository, cacheService);
export const authController = new AuthController(authService);
