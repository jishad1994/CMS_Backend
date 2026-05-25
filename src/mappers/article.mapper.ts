import type { ArticleDocument } from "../models/article.model.js";
import type { ArticleResponseDto } from "../dtos/article.dto.js";

export const mapArticleToResponseDto = (
  article: ArticleDocument,
): ArticleResponseDto => {
  return {
    id: article._id.toString(),
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    content: article.content,
    status: article.status,
    authorId: article.author.toString(),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};

export const mapArticlesArrayToResponseDto = (
  articles: ArticleDocument[],
): ArticleResponseDto[] => {
  return articles.map(mapArticleToResponseDto);
};