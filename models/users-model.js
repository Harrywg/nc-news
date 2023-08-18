const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUsersByUsername = (params) => {
  const { username } = params;
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "Not Found", custom: true });
      }
      return rows;
    });
};
