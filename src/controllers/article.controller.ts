import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";
import { IArticleService } from "../services/article/article.service.interface.js";
import { HTTP_MESSAGES } from "../constants/http.messages.contants.js";
import { ApiResponse } from "../utils/apiResponse.util.js";

export class ArticleController {
    constructor(private readonly articleService: IArticleService) {}

    createArticle = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            if (!req.user) {
                throw new AppError(HTTP_MESSAGES.UNAUTHORIZED, 401);
            }

            const article = await this.articleService.createArticle(req.body, req.user.userId);

            return ApiResponse.success(res, HTTP_MESSAGES.CREATED, article);
        } catch (error) {
            next(error);
        }
    };

    getPublishedArticles = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const { articles, paginationMeta } = await this.articleService.getPublishedArticles(page, limit);

            return ApiResponse.success(res, HTTP_MESSAGES.DATA_FETCH_SUCCESSFULL, articles, 200, paginationMeta);
        } catch (error) {
            next(error);
        }
    };

    getArticleBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const { slug } = req.params;

            if (!slug || typeof slug !== "string") {
                throw new AppError(HTTP_MESSAGES.VALIDATION_ERROR, 400);
            }

            const article = await this.articleService.getArticleBySlug(slug);

            return ApiResponse.success(res, HTTP_MESSAGES.DATA_FETCH_SUCCESSFULL, article);
        } catch (error) {
            next(error);
        }
    };
    getArticleById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const { id } = req.params;
            console.log("article id", id);
            if (!id || typeof id !== "string") {
                throw new AppError(HTTP_MESSAGES.VALIDATION_ERROR, 400);
            }

            const article = await this.articleService.getArticleById(id);
            return ApiResponse.success(res, HTTP_MESSAGES.DATA_FETCH_SUCCESSFULL, article);
        } catch (error) {
            next(error);
        }
    };

    getMyArticles = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            if (!req.user) {
                console.log("auth user", req.user);
                throw new AppError(HTTP_MESSAGES.UNAUTHORIZED, 401);
            }

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            console.log(page, limit);

            const { articles, paginationMeta } = await this.articleService.getMyArticles(req.user.userId, page, limit);

            return ApiResponse.success(res, HTTP_MESSAGES.DATA_FETCH_SUCCESSFULL, articles, 200, paginationMeta);
        } catch (error) {
            next(error);
        }
    };

    updateArticle = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const { id } = req.params;

            if (!id || typeof id !== "string") {
                throw new AppError(HTTP_MESSAGES.VALIDATION_ERROR, 400);
            }

            const article = await this.articleService.updateArticle(id, req.user.userId, req.body);

            return ApiResponse.success(res, HTTP_MESSAGES.UPDATED, article);
        } catch (error) {
            next(error);
        }
    };

    deleteArticle = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            if (!req.user) {
                throw new AppError(HTTP_MESSAGES.UNAUTHORIZED, 401);
            }
            const { id } = req.params;

            if (!id || typeof id !== "string") {
                throw new AppError(HTTP_MESSAGES.VALIDATION_ERROR, 400);
            }

            const result = await this.articleService.deleteArticle(id, req.user.userId);

            return ApiResponse.success(res, HTTP_MESSAGES.DELETED, result);
        } catch (error) {
            next(error);
        }
    };
}
