import type { Model } from "mongoose";
import { BaseRepository } from "./base.repository.js";
import type { Article, ArticleDocument } from "../../models/article.model.js";
import type { IArticleRepository } from "../interfaces/article.repository.interface.js";

export class ArticleRepository extends BaseRepository<Article> implements IArticleRepository {
    constructor(model: Model<Article>) {
        super(model);
    }

     async findById(id: string): Promise<ArticleDocument | null> {
        return this.model.findById(id).populate("author", "name email").exec();
    }

    async findAllPublished(page: number, limit: number): Promise<[articles: ArticleDocument[], count: number]> {
        const skip = (page - 1) * limit;



        const [articles, count] = await Promise.all([
            this.model
                .find({ status: "published" })
                .populate("author", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            this.model.countDocuments({ status: "published" }).exec(),
        ]);

        return [articles, count];
    }

    async findBySlug(slug: string): Promise<ArticleDocument | null> {
        return this.model.findOne({ slug }).populate("author", "name email").exec();
    }

    async findByAuthor(
        authorId: string,
        page: number,
        limit: number,
    ): Promise<[articles: ArticleDocument[], count: number]> {
        const skip = (page - 1) * limit;

        const [articles, count] = await Promise.all([
            this.model.find({ author: authorId }).populate("author", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),

            this.model.countDocuments({ author: authorId }).exec(),
        ]);

        return [articles, count];
    }

    async findBySlugExcludingId(slug: string, articleId: string): Promise<ArticleDocument | null> {
        return this.model
            .findOne({
                slug,
                _id: { $ne: articleId },
            })
            .exec();
    }
}
