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
