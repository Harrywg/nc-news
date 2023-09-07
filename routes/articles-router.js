const articlesRouter = require("express").Router();
const { articlesController, commentsController } = require("../controllers/");

articlesRouter.get("/", articlesController.getArticles);

articlesRouter.post("/", articlesController.postArticle);

articlesRouter.get("/:article_id", articlesController.getArticlesById);

articlesRouter.patch("/:article_id", articlesController.patchVotes);

articlesRouter.get(
  "/:article_id/comments",
  commentsController.getCommentsByArticleId
);

articlesRouter.post(
  "/:article_id/comments",
  commentsController.postCommentByArticleId
);

articlesRouter.delete("/:article_id", articlesController.deleteArticleById);

module.exports = articlesRouter;
