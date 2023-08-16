const format = require("pg-format");
const db = require("../db/connection");
exports.selectCommentsByArticleId = (params) => {
  const id = params.article_id;
  let query = `
  SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at DESC;
  `;
  return db.query(query, [id]).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentsByArticleId = (reqBody, params) => {
  const created_at = new Date(Date.now());
  const author = reqBody.username;
  const body = reqBody.body;
  const article_id = params.article_id;

  const values = [[created_at, author, body, article_id]];

  let query = `
  INSERT INTO comments (created_at, author, body, article_id)
  VALUES %L;
  `;

  const formattedQuery = format(query, values);
  console.log(formattedQuery);

  return db.query(formattedQuery).then(({ rows }) => {
    return rows;
  });
};
