const db = require("../db/connection");
exports.selectCommentsByArticleId = (params) => {
  const id = params.article_id;

  let query = `
  SELECT * FROM comments WHERE article_id = $1
  ORDER BY created_at DESC;
  `;

  let checkQuery = `SELECT * FROM articles WHERE article_id = $1;`;

  return db.query(checkQuery, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not Found", code: 404, custom: true });
    }

    return db.query(query, [id]).then(({ rows }) => {
      return rows;
    });
  });
};
