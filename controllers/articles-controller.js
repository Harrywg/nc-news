const {
  selectArticles,
  selectArticlesById,
  updateVotes,
  addArticle,
  removeArticleById,
} = require("../models/articles-model");

exports.getArticles = (req, res, next) => {
  selectArticles(req.params, req.query)
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

exports.postArticle = (req, res, next) => {
  addArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => next(err));
};

exports.deleteArticleById = (req, res, next) => {
  removeArticleById(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
