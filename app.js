const express = require("express");
const app = express();

const { errorHandler } = require("./error-handler");
const { topicsController, endpointsController } = require("./controllers/");

app.get("/api/topics", topicsController.getTopics);

app.get("/api", endpointsController.getEndpoints);

app.use(errorHandler);

module.exports = app;
