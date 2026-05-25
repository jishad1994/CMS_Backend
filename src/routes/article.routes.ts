import express from "express";
import { articleController } from "../dependencies/container.dependencies";
import { validate } from "../middlewares/validate.middleware";
import { createArticleSchema, updateArticleSchema } from "../dtos/article.dto";

const articleRoutes = express.Router();

articleRoutes.get("/", articleController.getPublishedArticles.bind(articleController));

articleRoutes.get("/:slug", articleController.getArticleBySlug.bind(articleController));

articleRoutes.get("/my-articles", articleController.getMyArticles.bind(articleController));

articleRoutes.post("/", validate(createArticleSchema, ["body"]), articleController.createArticle.bind(articleController));

articleRoutes.put("/:id", validate(updateArticleSchema, ["body"]), articleController.updateArticle.bind(articleController));

articleRoutes.delete("/:id", articleController.deleteArticle.bind(articleController));


export default articleRoutes
