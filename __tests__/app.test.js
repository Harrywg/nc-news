const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("/api", () => {
  describe("GET", () => {
    test("200 when request all endpoints", () => {
      return request(app).get("/api").expect(200);
    });
    test("200 + returns endpoints when request all endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(require("../endpoints.json"));
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("200 when request all topics", () => {
      return request(app).get("/api/topics").expect(200);
    });
    test("200 + return correct data from topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const expectedOut = [
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" },
          ];
          expect(body.topics).toEqual(expectedOut);
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200 + returns all articles with correct properties and values, sorted by created_at", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                comment_count: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              })
            );
          });
        });
    });
    test("200 + ?sort_by sorts articles with dynamic sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("title", { descending: true });
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                comment_count: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              })
            );
          });
        });
    });
    test("400 + ?sort_by returns error when invalid query parameter", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("200 + ?order accepts ASC or DESC and returns ordered data", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("created_at");
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                comment_count: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
              })
            );
          });
        });
    });
    test("400 + ?order returns err for invalid queries", () => {
      return request(app)
        .get("/api/articles?order=bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("200 + ?topic filters by given topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(1);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles[0]).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "cats",
              author: expect.any(String),
              comment_count: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    });
    test("404 + ?topic returns err if can't find given topic", () => {
      return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("200 + ?topic returns no data when no articles match given topic", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toEqual([]);
        });
    });
  });

  describe("POST", () => {
    test("201 + returns posted article", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "lurker",
          title: "I can't stop lurking",
          body: "That's about it",
          topic: "cats",
        })
        .expect(201)
        .then(({ body }) => {
          const article = body.article;
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 14,
              title: "I can't stop lurking",
              topic: "cats",
              author: "lurker",
              body: "That's about it",
              created_at: expect.any(String),
              votes: 0,
              article_img_url: expect.any(String),
              comment_count: "0",
            })
          );
        });
    });
    test("400 + returns msg when invalid body", () => {
      return request(app)
        .post("/api/articles")
        .send({
          invalid_body: true,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("GET by id", () => {
    test("200 + returns correct article object with correct properties including comment_count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).toBe(1);
          const article = body.article[0];
          expect(article.article_id).toBe(1);
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
          expect(+article.comment_count).toBe(11);
        });
    });
    test("400 + returns msg when not passed a number as id", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("404 + returns msg id doesn't exist", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });

  describe("GET article comments by id", () => {
    test("200 + returns array of comments with correct properties and values", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toBeSortedBy("created_at", { descending: true });
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            );
          });
        });
    });
    test("200 + return no comments when article has no comments", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toHaveLength(0);
        });
    });
    test("404 + return msg when article isn't found", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Not Found" });
        });
    });
    test("400 + return msg when passed invalid id", () => {
      return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Bad Request" });
        });
    });
  });

  describe("POST comments by article id", () => {
    test("201 when passed valid comment to valid article id", () => {
      const comment = {
        username: "lurker",
        body: "hello",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual(comment);
        });
    });
    test("404 + return msg when passed article id that doesn't exist", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({
          username: "lurker",
          body: "hello",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400 + return msg when passed invalid article id", () => {
      return request(app)
        .post("/api/articles/banana/comments")
        .send({
          username: "lurker",
          body: "hello",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("400 + return msg when passed incompatible body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          invalid: true,
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("PATCH article votes by article id", () => {
    test("returns 200 with updated article when valid id and valid body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).toBe(1);
          const article = body.article[0];
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: 105,
              article_img_url: expect.any(String),
            })
          );
        });
    });
    test("returns 200 with updated article when valid id and valid body with negative votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.length).toBe(1);
          const article = body.article[0];
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: 95,
              article_img_url: expect.any(String),
            })
          );
        });
    });

    test("returns 400 when given invalid body", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ votes: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("returns 404 given article id that doesn't exist", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 3 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("returns 400 given invalid article id", () => {
      return request(app)
        .patch("/api/articles/banana")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("/api/comments", () => {
  describe("DELETE comment by comment id", () => {
    test("204 + returns no body when sent valid id, comment is deleted", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body.msg).toBe(undefined);
          return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBe(1);
            });
        });
    });
    test("404 + returns msg when sent id that doesn't exist", () => {
      return request(app)
        .delete("/api/comments/9999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400 + returns msg when sent invalid path", () => {
      return request(app)
        .delete("/api/comments/apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("PATCH comment votes by comment id", () => {
    test("200 + updates comment votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.length).toBe(1);
          const comment = body.comment[0];
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: 21,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("200 + updated comments votes when passed negative votes", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.length).toBe(1);
          const comment = body.comment[0];
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 1,
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: 11,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("400 + msg when invalid body", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ invalid_body: true })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("400 + msg when id not a number", () => {
      return request(app)
        .patch("/api/comments/banana")
        .send({ inc_votes: 5 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("404 + msg when passed id that does not exist", () => {
      return request(app)
        .patch("/api/comments/999999")
        .send({ inc_votes: 5 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET users", () => {
    test("200 + returns all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET users by username", () => {
    test("200 + returns all users with username", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(1);
          const user = body.users[0];
          expect(user).toEqual(
            expect.objectContaining({
              username: "lurker",
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
    });
    test("404 + returns msg when passed username that doesn't exist", () => {
      return request(app)
        .get("/api/users/notarealuser")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});
