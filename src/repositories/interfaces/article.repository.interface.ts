import { Article, ArticleDocument } from "../../models/article.model.js";
import { IBaseRepository } from "./base.repository.interface.js";

export interface IArticleRepository extends IBaseRepository<Article> {

    findAllPublished(page:number,limit:number): Promise<[articles:ArticleDocument[],total:number]>;

    findBySlug(slug: string): Promise<ArticleDocument | null>;

    findByAuthor(authorId: string,page:number,limit:number): Promise<[articles:ArticleDocument[],total:number]>;

    findBySlugExcludingId(slug: string, articleId: string): Promise<ArticleDocument | null>;
    
}
