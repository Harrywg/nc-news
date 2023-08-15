const {
  selectCommentsByArticleId,
  insertCommentsByArticleId,
} = require("../models/comments-model");

exports.getCommentsByArticleId = (req, res, next) => {
  selectCommentsByArticleId(req.params)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentsByArticleId(req.params)
    .then((result) => {
      res.status(200).send({ result });
    })
    .catch((err) => next(err));
};
