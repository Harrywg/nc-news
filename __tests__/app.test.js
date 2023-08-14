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
  describe.only("GET by id", () => {
    test("200 when request article by valid id", () => {
      return request(app).get("/api/articles/1").expect(200);
    });
    test("200 + returns correct article object with correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const article = body.article[0];
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
    test("200 + returns article object with correct id for multiple ids", () => {
      const reqById = (id) => {
        return request(app)
          .get(`/api/articles/${id}`)
          .expect(200)
          .then(({ body }) => {
            const article = body.article[0];
            expect(article.article_id).toBe(id);
          });
      };
      return reqById(1)
        .then(() => {
          return reqById(2);
        })
        .then(() => {
          return reqById(3);
        });
    });
  });
});
