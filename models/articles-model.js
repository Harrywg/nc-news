const db = require("../db/connection");

exports.selectArticles = (params) => {
  let query = `SELECT * FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  ORDER BY $1`;

  const sortBy = params.query.sortBy || "created_at DESC";
  //if selectById
  if (params.article_id) query += ` WHERE article_id = ${params.article_id}`;
  query += ";";

  return db.query(query, [sortBy]).then(({ rows }) => {
    return rows;
  });
};
