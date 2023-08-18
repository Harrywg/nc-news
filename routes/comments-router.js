const commentsRouter = require("express").Router();
const { commentsController } = require("../controllers/");

commentsRouter.delete(
  "/:comment_id",
  commentsController.deleteCommentByCommentId
);

commentsRouter.patch("/:comment_id", commentsController.patchVotes);

module.exports = commentsRouter;
