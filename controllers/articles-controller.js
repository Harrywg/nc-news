const {
  selectArticles,
  selectArticlesById,
  updateVotes,
} = require("../models/articles-model");

exports.getArticles = (req, res, next) => {
  selectArticles(req.params)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticlesById = (req, res, next) => {
  selectArticlesById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.patchVotes = (req, res, next) => {
  updateVotes(req.body, req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
