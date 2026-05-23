import type {
    ArticleResponseDto,
    CreateArticleDto,
    DeleteArticleResponseDto,
    UpdateArticleDto,
} from "../../dtos/article.dto.js";
import { PaginationMeta } from "../../utils/apiResponse.util.js";

export interface IArticleService {
    createArticle(dto: CreateArticleDto, authorId: string): Promise<ArticleResponseDto>;

    getPublishedArticles(
        page: number,
        limit: number,
    ): Promise<{ articles: ArticleResponseDto[]; paginationMeta: PaginationMeta }>;

    getArticleBySlug(slug: string): Promise<ArticleResponseDto>;

    getMyArticles(
        authorId: string,
        page: number,
        limit: number,
    ): Promise<{ articles: ArticleResponseDto[]; paginationMeta: PaginationMeta }>;

    updateArticle(articleId: string, authorId: string, dto: UpdateArticleDto): Promise<ArticleResponseDto | null>;

    deleteArticle(articleId: string, authorId: string): Promise<DeleteArticleResponseDto>;
}
