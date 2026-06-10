import type { ArticleDocument } from "../models/article.model.js";
import type { ArticleResponseDto } from "../dtos/article.dto.js";
import { Types } from "mongoose";

export const mapArticleToResponseDto = (article: ArticleDocument): ArticleResponseDto => {
    const author = (article.author as unknown) as { _id: Types.ObjectId; name: string; email: string };
    return {
        id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        status: article.status,
        authorId: article.author.toString(),
        author: {
            id: author._id.toString(),
            name: author.name,
            email: author.email,
        },
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
    };
};

export const mapArticlesArrayToResponseDto = (articles: ArticleDocument[]): ArticleResponseDto[] => {
    return articles.map(mapArticleToResponseDto);
};
