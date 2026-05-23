import { HydratedDocument, Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { ArticleDocument } from "../../models/article.model";
import { IArticleRepository } from "../interfaces/article.repository.interface";

export class ArticleRepository extends BaseRepository<HydratedDocument<ArticleDocument>> implements IArticleRepository {
    constructor(model: Model<HydratedDocument<ArticleDocument>>) {
        super(model);
    }
    async findAllPublished(page:number,limit:number): Promise<[articles:HydratedDocument<ArticleDocument>[],total:number]> {
      
         const skip=(page-1)*limit

        const [articles,count]= await Promise.all([
           
            this.model.find({ status: "published" }).populate("author", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
           
            this.model.countDocuments({status:"published"})
        ]) 

        return[articles,count]
    }

    async findBySlug(slug: string): Promise<HydratedDocument<ArticleDocument> | null> {
        return this.model.findOne({ slug }).populate("author", "name email").exec();
    }

    async findByAuthor(authorId: string,page:number,limit:number): Promise<[articles:HydratedDocument<ArticleDocument>[],total:number]> {
       
       const skip=(page-1)*limit

        const [articles,count]= await Promise.all([ 

            this.model.find({ author: authorId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),

            this.model.countDocuments({author:authorId})

        ]) 

        return[articles,count]
    }

    async findBySlugExcludingId(slug: string, articleId: string): Promise<HydratedDocument<ArticleDocument> | null> {
        return this.model.findOne({
            slug,
            _id: { $ne: articleId },
        }).exec();
    }
}
