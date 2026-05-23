import { HydratedDocument } from "mongoose";
import { ArticleDocument } from "../../models/article.model.js";
import { IBaseRepository } from "./base.repository.interface.js";

export interface IArticleRepository extends IBaseRepository<HydratedDocument<ArticleDocument>> {

    findAllPublished(page:number,limit:number): Promise<[articles:HydratedDocument<ArticleDocument>[],total:number]>;

    findBySlug(slug: string): Promise<HydratedDocument<ArticleDocument> | null>;

    findByAuthor(authorId: string,page:number,limit:number): Promise<[articles:HydratedDocument<ArticleDocument>[],total:number]>;

    findBySlugExcludingId(slug: string, articleId: string): Promise<HydratedDocument<ArticleDocument> | null>;
    
}
