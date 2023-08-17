const db = require("../db/connection");

exports.selectArticlesById = (params) => {
  let query = `SELECT * FROM articles`;

  query += ` WHERE article_id = ${params.article_id}`;
  query += ";";

  return db.query(query).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = (params, queries) => {
  let { sort_by, order, topic } = queries;

  switch (sort_by) {
    case "article_id":
    case "title":
    case "topic":
    case "author":
    case "comment_count":
    case "created_at":
    case "votes":
    case "article_img_url":
      break;
    case undefined:
      sort_by = "created_at";
      break;
    default:
      return Promise.reject({ code: 400, msg: "Bad Request", custom: true });
  }

  switch (order) {
    case "ASC":
    case "DESC":
      break;
    case undefined:
      order = "DESC";
      break;
    default:
      return Promise.reject({ code: 400, msg: "Bad Request", custom: true });
  }

  const query = `
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
    ${topic ? `WHERE topic='${topic}'` : ""}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
    `;

  const checkQuery = `
    SELECT * 
    FROM topics 
    WHERE slug='${topic}'`;

  const checkTopicsQuery = () => {
    return db.query(checkQuery).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "Not Found", custom: true });
      }
    });
  };

  const mainQuery = () => {
    return db.query(query).then(({ rows }) => {
      return rows;
    });
  };

  if (topic) {
    return checkTopicsQuery().then(() => {
      return mainQuery();
    });
  } else return mainQuery();
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
