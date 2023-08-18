const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { errorHandler } = require("./error-handler");

app.use(express.json());
app.use("/api", apiRouter);
app.use(errorHandler);

module.exports = app;
