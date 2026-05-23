import { Schema, model, InferSchemaType, Types } from "mongoose";

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 180
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: 300
    },

    content: {
      type: String,
      required: [true, "Content is required"]
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

articleSchema.index({ title: "text", summary: "text" });

export type ArticleDocument = InferSchemaType<typeof articleSchema> & {
  author: Types.ObjectId;
};

export const ArticleModel = model("Article", articleSchema);