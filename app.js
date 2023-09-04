const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/api-router");
const { errorHandler } = require("./error-handler");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(errorHandler);

module.exports = app;
