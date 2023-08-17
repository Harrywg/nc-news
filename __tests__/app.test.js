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
  });

  describe("GET by id", () => {
    test("200 + returns correct article object with correct properties", () => {
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
            })
          );
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
});
