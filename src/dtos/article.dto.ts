import { z } from "zod";

export const createArticleSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(180, "Title is too long"),

    summary: z.string().trim().min(10, "Summary must be at least 10 characters").max(300, "Summary is too long"),

    content: z.string().trim().min(10, "Content is required"),

    status: z.enum(["draft", "published"]).optional(),
});

export const updateArticleSchema = z.object({
    title: z.string().trim().min(3).max(180).optional(),

    summary: z.string().trim().min(10).max(300).optional(),

    content: z.string().trim().min(10).optional(),

    status: z.enum(["draft", "published"]).optional(),
});

export type CreateArticleDto = z.infer<typeof createArticleSchema>;

export type UpdateArticleDto = z.infer<typeof updateArticleSchema>;

export enum ArticleStatus {
    Draft = "draft",
    Published = "published",
}
export interface ArticleAuthorDto {
    id: string;
    name: string;
    email: string;
}
export interface DeleteArticleResponseDto {
    message: string;
}

export interface ArticleResponseDto {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: "draft" | "published";
    authorId: string;
    author: ArticleAuthorDto;
    createdAt: Date;
    updatedAt: Date;
}
