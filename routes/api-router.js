const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("../routes/users-router");

const endpointsController = require("../controllers/endpoints-controller");

apiRouter.get("/", endpointsController.getEndpoints);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
