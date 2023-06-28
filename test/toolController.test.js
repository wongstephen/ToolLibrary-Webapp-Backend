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

    it("should not retrieve tools for invalid token", async () => {
      const response = await request
        .get("/tools")
        .set("Authorization", `Bearer ${authToken}123`);
      expect(response.status).to.equal(401);
    });

    it("should post a new tool with tool name only", async () => {
      const response = await request
        .post("/tools/image")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Content-Type", "multipart/form-data")
        .field("name", "Shovel");
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("name", "Shovel");
    });

    it("should not post a new tool with loanee only", async () => {
      const response = await request
        .post("/tools/image")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Content-Type", "multipart/form-data")
        .field("name", "")
        .field("loanee", "Shawn");
      console.log(response.status);
      expect(response.status).to.equal(500);
    });

    it("should not post a new tool with name and loanee", async () => {
      const response = await request
        .post("/tools/image")
        .set("Authorization", `Bearer ${authToken}`)
        .set("Content-Type", "multipart/form-data")
        .field("name", "Wrench")
        .field("loanee", "Shawn");
      console.log(response.status);
      expect(response.status).to.equal(201);
    });
  });
});
