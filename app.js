const express = require("express");
const app = express();

const { errorHandler } = require("./error-handler");
const {
  topicsController,
  endpointsController,
  articlesController,
  commentsController,
} = require("./controllers/");

app.use(express.json());

app.get("/api", endpointsController.getEndpoints);

app.get("/api/topics", topicsController.getTopics);

app.get("/api/articles", articlesController.getArticles);

app.get("/api/articles/:article_id", articlesController.getArticlesById);

app.patch("/api/articles/:article_id", articlesController.patchVotes);

app.get(
  "/api/articles/:article_id/comments",
  commentsController.getCommentsByArticleId
);

app.post(
  "/api/articles/:article_id/comments",
  commentsController.postCommentByArticleId
);

app.delete(
  "/api/comments/:comment_id",
  commentsController.deleteCommentByCommentId
);
app.use(errorHandler);

module.exports = app;
