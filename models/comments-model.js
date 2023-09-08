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
  VALUES %L
  RETURNING *;
  `;

  const formattedQuery = format(query, values);

  const checkQuery = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(checkQuery, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not Found", code: 404, custom: true });
    }
    return db.query(formattedQuery).then(({ rows }) => {
      return rows[0];
    });
  });
};

exports.removeCommentByCommentId = (params) => {
  const id = params.comment_id;
  const checkQuery = `SELECT * FROM comments WHERE comment_id = $1;`;
  const deleteQuery = `DELETE FROM comments WHERE comment_id = $1;`;
  return db.query(checkQuery, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ msg: "Not Found", code: 404, custom: true });
    }
    return db.query(deleteQuery, [id]);
  });
};

exports.updateVotes = (body, params) => {
  const id = params.comment_id;
  const votesToAdd = body.inc_votes;

  let query = `
  UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1;
  `;

  const getComment = () => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [id]);
  };

  return getComment()
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "Not Found", custom: true });
      }
      return db.query(query, [id, votesToAdd]);
    })
    .then(() => {
      return getComment();
    })
    .then(({ rows }) => {
      return rows;
    });
};
