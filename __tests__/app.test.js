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
    test("200 when request all articles", () => {
      return request(app).get("/api/articles").expect(200);
    });
    test("200 + return correct data from articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          articles.forEach((article) => {
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
  });
  describe("GET by id", () => {
    test("200 when request article by valid id", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("200 + returns correct article object with correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article[0];
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
    test("200 + returns article object with correct id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article[0];
          expect(article.article_id).toBe(1);
        });
    });
  });
});
