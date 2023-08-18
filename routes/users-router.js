const usersRouter = require("express").Router();
const { usersController } = require("../controllers/");

usersRouter.get("/", usersController.getUsers);

usersRouter.get("/:username", usersController.getUsersByUsername);

module.exports = usersRouter;
