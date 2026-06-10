import type { ArticleDocument } from "../models/article.model.js";
import type { ArticleResponseDto } from "../dtos/article.dto.js";
import { Types } from "mongoose";

interface PopulatedAuthor {
    _id: Types.ObjectId;
    name: string;
    email: string;
}
export const mapArticleToResponseDto = (article: ArticleDocument): ArticleResponseDto => {
    const isPopulated = (author: Types.ObjectId | PopulatedAuthor): author is PopulatedAuthor => {
        return typeof author === "object" && "name" in author;
    };

    const rawAuthor = (article.author as unknown) as Types.ObjectId | PopulatedAuthor;

    const author = isPopulated(rawAuthor)
        ? {
              id: rawAuthor._id.toString(),
              name: rawAuthor.name,
              email: rawAuthor.email,
          }
        : {
              id: rawAuthor.toString(),
              name: "Unknown",
              email: "",
          };
    return {
        id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        status: article.status,
        authorId: author.id,
        author,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
    };
};

export const mapArticlesArrayToResponseDto = (articles: ArticleDocument[]): ArticleResponseDto[] => {
    return articles.map(mapArticleToResponseDto);
};
