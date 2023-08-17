const db = require("../db/connection");

exports.selectArticlesById = (params) => {
  let query = `SELECT * FROM articles`;

  query += ` WHERE article_id = ${params.article_id}`;
  query += ";";

  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  //hard coded for now, intending to change if adding queries
  let query = `
    SELECT 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `;

  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.updateVotes = (body, params) => {
  const id = params.article_id;
  const votesToAdd = body.inc_votes;
  let query = `
  UPDATE articles 
  SET votes = votes + $2
  WHERE article_id = $1;
  `;

  const getArticle = () => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
  };

  return getArticle().then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ code: 404, msg: "Not Found", custom: true });

    return db.query(query, [id, votesToAdd]).then(() => {
      return getArticle().then(({ rows }) => {
        return rows;
      });
    });
  });
};
