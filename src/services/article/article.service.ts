import mongoose from "mongoose";
import { ArticleResponseDto, ArticleStatus, CreateArticleDto, UpdateArticleDto } from "../../dtos/article.dto";
import { AppError } from "../../errors/app.error";
import { IArticleRepository } from "../../repositories/interfaces/article.repository.interface";
import { sanitizeArticleHtml } from "../../utils/sanitize-html.util";
import { generateSlug } from "../../utils/slug.util";
import { IArticleService } from "./article.service.interface";
import { ERROR_MESSAGES } from "../../constants/erro.messages.constants";
import { HTTP_MESSAGES } from "../../constants/http.messages.contants";
import { mapArticlesArrayToResponseDto, mapArticleToResponseDto } from "../../mappers/article.mapper";
import { PaginationMeta } from "../../utils/apiResponse.util";

export class ArticleService implements IArticleService {
    constructor(private readonly articleRepository: IArticleRepository) {}

    async createArticle(dto: CreateArticleDto, authorId: string): Promise<ArticleResponseDto> {
        const slug = generateSlug(dto.title);

        const existingArticle = await this.articleRepository.findBySlug(slug);

        if (existingArticle) {
            throw new AppError(ERROR_MESSAGES.ARTICLE_WITH_SAME_NAME_EXISTS, 409);
        }

        const sanitizedContent = sanitizeArticleHtml(dto.content);

        const article = await this.articleRepository.create({
            title: dto.title,
            slug,
            summary: dto.summary,
            content: sanitizedContent,
            status: dto.status ?? ArticleStatus.Draft,
            author: new mongoose.Types.ObjectId(authorId),
        });

        return mapArticleToResponseDto(article);
    }

    async getPublishedArticles(
        page: number,
        limit: number = 10,
    ): Promise<{ articles: ArticleResponseDto[]; paginationMeta: PaginationMeta }> {
        const [articles, total] = await this.articleRepository.findAllPublished(page, limit);
        const totalPages = Math.ceil(total / limit);

        const paginationMeta: PaginationMeta = {
            page,
            limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };

        const mappedArticles = mapArticlesArrayToResponseDto(articles);

        return { articles: mappedArticles, paginationMeta };
    }

    async getArticleBySlug(slug: string): Promise<ArticleResponseDto> {
        const article = await this.articleRepository.findBySlug(slug);

        if (!article || article.status !== ArticleStatus.Published) {
            throw new AppError(ERROR_MESSAGES.ARTICLE_NOT_FOUND, 404);
        }

        return mapArticleToResponseDto(article);
    }

    async getMyArticles(authorId: string, page: number, limit: number = 10) {
        const [articles, total] = await this.articleRepository.findByAuthor(authorId, page, limit);

        const totalPages = Math.ceil(total / limit);

        const paginationMeta: PaginationMeta = {
            page,
            limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };

        const mappedArticles = mapArticlesArrayToResponseDto(articles);

        return { articles: mappedArticles, paginationMeta };
    }

    async updateArticle(articleId: string, authorId: string, dto: UpdateArticleDto) {
        const article = await this.articleRepository.findById(articleId);

        if (!article) {
            throw new AppError(ERROR_MESSAGES.ARTICLE_NOT_FOUND, 404);
        }

        if (article.author.toString() !== authorId) {
            throw new AppError(HTTP_MESSAGES.UNAUTHORIZED, 403);
        }

        const updateData: Partial<{
            title: string;
            slug: string;
            summary: string;
            content: string;
            status: "draft" | "published";
        }> = {};

        if (dto.title) {
            const newSlug = generateSlug(dto.title);

            const slugConflict = await this.articleRepository.findBySlugExcludingId(newSlug, articleId);

            if (slugConflict) {
                throw new AppError(ERROR_MESSAGES.ARTICLE_WITH_SAME_NAME_EXISTS, 409);
            }

            updateData.title = dto.title;
            updateData.slug = newSlug;
        }

        if (dto.summary) {
            updateData.summary = dto.summary;
        }

        if (dto.content) {
            updateData.content = sanitizeArticleHtml(dto.content);
        }

        if (dto.status) {
            updateData.status = dto.status;
        }

        const updatedArticle = await this.articleRepository.updateById(articleId, updateData);

        return mapArticleToResponseDto(updatedArticle);
    }

    async deleteArticle(articleId: string, authorId: string) {
        const article = await this.articleRepository.findById(articleId);

        if (!article) {
            throw new AppError(ERROR_MESSAGES.ARTICLE_NOT_FOUND, 404);
        }

        if (article.author.toString() !== authorId) {
            throw new AppError(HTTP_MESSAGES.UNAUTHORIZED, 403);
        }

        await this.articleRepository.deleteById(articleId);

        return {
            message: HTTP_MESSAGES.DELETED,
        };
    }
}
