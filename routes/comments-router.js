const commentsRouter = require("express").Router();
const { commentsController } = require("../controllers/");

commentsRouter.delete(
  "/:comment_id",
  commentsController.deleteCommentByCommentId
);

module.exports = commentsRouter;
