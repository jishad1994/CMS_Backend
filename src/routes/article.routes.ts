import express from "express";
import { articleController } from "../dependencies/container.dependencies";
import { validate } from "../middlewares/validate.middleware";
import { createArticleSchema, updateArticleSchema } from "../dtos/article.dto";
import { authMiddleware } from "../middlewares/auth.middleware";

const articleRoutes = express.Router();

articleRoutes.get("/", articleController.getPublishedArticles.bind(articleController));

articleRoutes.get("/my-articles", authMiddleware, articleController.getMyArticles.bind(articleController));

articleRoutes.get("/slug/:slug", articleController.getArticleBySlug.bind(articleController));

articleRoutes.get("/:id", articleController.getArticleById.bind(articleController));

articleRoutes.post(
    "/",

    authMiddleware,
    validate(createArticleSchema, ["body"]),
    articleController.createArticle.bind(articleController),
);

articleRoutes.put(
    "/:id",

    authMiddleware,
    validate(updateArticleSchema, ["body"]),
    articleController.updateArticle.bind(articleController),
);

articleRoutes.delete("/:id", authMiddleware, articleController.deleteArticle.bind(articleController));

export default articleRoutes;
