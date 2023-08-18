const usersRouter = require("express").Router();
const { usersController } = require("../controllers/");

usersRouter.get("/", usersController.getUsers);

module.exports = usersRouter;
