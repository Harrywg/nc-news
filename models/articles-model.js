const db = require("../db/connection");

exports.selectArticles = (params) => {
  let query = `SELECT * FROM articles`;

  //if selectById
  if (params.article_id) query += ` WHERE article_id = ${params.article_id}`;
  query += ";";

  return db.query(query).then(({ rows }) => {
    return rows;
  });
};
