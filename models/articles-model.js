const db = require("../db/connection");

exports.selectArticlesById = (params) => {
  const id = params.article_id;

  if (isNaN(+id)) {
    return Promise.reject({ code: 400, msg: "Bad Request", custom: true });
  }

  const query = `
    SELECT 
      articles.*,  
      COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = ${id}
    GROUP BY articles.article_id;`;

  return db.query(query).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ code: 404, msg: "Not Found", custom: true });
    }
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
    default:
      sort_by = "created_at";
  }

  if (order !== "ASC" && order !== "DESC") order = undefined;
  order = order || "DESC";

  let query = `
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
  return db.query(query).then(({ rows }) => {
    return rows;
  });
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
