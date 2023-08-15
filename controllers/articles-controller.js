const { selectArticles } = require("../models/articles-model");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles(article_id)
    .then((article) => {
      console.log("123");
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
