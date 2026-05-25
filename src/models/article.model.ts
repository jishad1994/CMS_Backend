import { Schema, model, Types, HydratedDocument } from "mongoose";

export type ArticleStatus = "draft" | "published";

export interface Article {
    title: string;
    slug: string;
    summary: string;
    content: string;
    status: ArticleStatus;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const articleSchema = new Schema<Article>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: 3,
            maxlength: 180,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        summary: {
            type: String,
            required: [true, "Summary is required"],
            trim: true,
            maxlength: 300,
        },

        content: {
            type: String,
            required: [true, "Content is required"],
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

articleSchema.index({ title: "text", summary: "text" });

export type ArticleDocument = HydratedDocument<Article>;

export const ArticleModel = model<Article>("Article", articleSchema);
