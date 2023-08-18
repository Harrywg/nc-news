const topicsRouter = require("express").Router();
const { topicsController } = require("../controllers/");

topicsRouter.get("/", topicsController.getTopics);

module.exports = topicsRouter;
