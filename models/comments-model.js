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

exports.insertCommentsByArticleId = (params) => {
  // pass this a comment object in test
  // ensure that obj can be passed into sql
  // INSERT INTO statement
  // Successful respnose will include username and body properties
  // -- author is the username
  return db.query(query).then(({ rows }) => {
    return rows;
  });
};
