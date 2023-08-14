const express = require("express");
const app = express();

const { errorHandler } = require("./error-handler");
const { topicsController } = require("./controllers/");

app.get("/api/topics", topicsController.getTopics);

app.use(errorHandler);

module.exports = app;
