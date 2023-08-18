const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticlesById = (params) => {
  const id = params.article_id;

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
  let { sort_by, order, topic, limit } = queries;

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

  if (limit === undefined) limit = 10;
  if (isNaN(+limit)) {
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
    ORDER BY ${sort_by} ${order}
    ${limit ? `LIMIT ${limit}` : ""};
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
  const query = `
  UPDATE articles 
  SET votes = votes + $2
  WHERE article_id = $1;
  `;

  const getArticle = () => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id]);
  };

  return getArticle()
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ code: 404, msg: "Not Found", custom: true });

      return db.query(query, [id, votesToAdd]);
    })
    .then(() => {
      return getArticle();
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.addArticle = (reqBody) => {
  let { author, title, body, topic, article_img_url } = reqBody;

  const query = `
  INSERT INTO articles (
    author,
    title,
    body,
    topic,
    article_img_url
  ) VALUES %L
  RETURNING article_id;`;

  if (!article_img_url) {
    article_img_url =
      "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png";
  }

  const values = [[author, title, body, topic, article_img_url]];

  const formattedQuery = format(query, values);

  const returnQuery = `
  SELECT 
    articles.*, 
    COUNT(comments.comment_id) AS comment_count 
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`;

  return db
    .query(formattedQuery)
    .then(({ rows }) => {
      const generatedId = rows[0].article_id;
      return db.query(returnQuery, [generatedId]);
    })
    .then(({ rows }) => {
      const article = rows[0];
      return article;
    });
};
