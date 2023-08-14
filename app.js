const express = require("express");
const app = express();

const { errorHandler } = require("./error-handler");
const {
  topicsController,
  endpointsController,
  articlesController,
} = require("./controllers/");

app.get("/api", endpointsController.getEndpoints);

app.get("/api/topics", topicsController.getTopics);

app.get("/api/articles/:article_id", articlesController.getArticlesById);

app.use(errorHandler);

module.exports = app;
