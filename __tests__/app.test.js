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
    test("200 + returns all articles with correct properties and values", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(13);
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
    test("200 + returns all articles sorted by created_at", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;

          //convert date format to seconds
          const seconds = articles.map((article) => {
            //use regex to split date format to Y M D h m s
            const splitTimes = article.created_at.split(/[-T:]/);
            const thisDate = new Date(
              Date.UTC(
                splitTimes[0],
                splitTimes[1],
                splitTimes[2],
                splitTimes[3],
                splitTimes[4]
              )
            );

            //invoke Date constructors getTime method, returns seconds
            return thisDate.getTime();
          });

          expect(seconds).toBeSorted({ descending: true });
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
});
