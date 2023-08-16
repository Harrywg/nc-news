const format = require("pg-format");
const db = require("../db/connection");
exports.selectCommentsByArticleId = (params) => {
  const id = params.article_id;
  if (isNaN(id)) {
    return Promise.reject({ msg: "Bad Request", code: 400, custom: true });
  }

  let query = `
  SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at DESC;
  `;
  const checkQuery = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(checkQuery, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not Found", code: 404, custom: true });
    }

    return db.query(query, [id]).then(({ rows }) => {
      return rows;
    });
  });
};

exports.insertCommentsByArticleId = (reqBody, params) => {
  const author = reqBody.username;
  const body = reqBody.body;
  const article_id = params.article_id;
  if (!author || !body) {
    return Promise.reject({ msg: "Bad Request", code: 400, custom: true });
  }

  const values = [[author, body, article_id]];

  let query = `
  INSERT INTO comments (author, body, article_id)
  VALUES %L;
  `;

  const formattedQuery = format(query, values);

  const checkQuery = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(checkQuery, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not Found", code: 404, custom: true });
    }
    return db.query(formattedQuery).then(() => {
      return reqBody;
    });
  });
};
