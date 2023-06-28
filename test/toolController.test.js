const supertest = require("supertest");
const app = require("../app");
const expect = require("chai").expect;

const request = supertest(app);

describe("toolController", () => {
  let authToken;

  before(async () => {
    const response = await request
      .post("/users/signin")
      .send({ email: "guest@user.com", password: "password" });
    authToken = response.body.token;
  });

  describe("GET /tools", () => {
    it("should retrieve an array of user tools for authenticaed user", async () => {
      const response = await request
        .get("/tools")
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
    });

    it("should not retrieve tools for unauthenticated user", async () => {
      const response = await request.get("/tools");
      expect(response.status).to.equal(401);
    });

    after(() => {
      process.exit();
    });
  });
});
