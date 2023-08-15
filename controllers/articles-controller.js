const { selectArticles } = require("../models/articles-model");

exports.getArticles = (req, res, next) => {
  selectArticles(req.params)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getArticlesById = (req, res, next) => {
  selectArticles(req.params)
    .then((article) => {
      console.log("123");
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
