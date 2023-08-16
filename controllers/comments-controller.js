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
  insertCommentsByArticleId(req.body, req.params)
    .then(() => {
      res.status(201).send();
    })
    .catch((err) => next(err));
};
