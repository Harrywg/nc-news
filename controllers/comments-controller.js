const { selectCommentsByArticleId } = require("../models/comments-model");

exports.getCommentsByArticleId = (req, res, next) => {
  console.log("in controller");
  selectCommentsByArticleId()
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => next(err));
};
