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

describe("generic errors", () => {
  test("404 when request route that does not exist", () => {
    return request(app).get("/api/incorrect_path").expect(404);
  });
});

describe("/api/treasures", () => {
  describe("GET", () => {
    test("200 when request all treasures", () => {
      return request(app).get("/api/topics").expect(200);
    });
  });
  describe("GET", () => {
    test("200 + return correct data from topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const eOut = [
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" },
          ];
          expect(body.topics).toEqual(eOut);
        });
    });
  });
});
