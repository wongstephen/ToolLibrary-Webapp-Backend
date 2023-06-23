const supertest = require("supertest");
const app = require("../app");
const expect = require("chai").expect;

const request = supertest(app);

describe("UserController", () => {
  let authToken;

  before(async () => {
    const response = await request
      .post("/users/signin")
      .send({ email: "guest@user.com", password: "password" });
    authToken = response.body.token;
  });

  describe("GET /users/single", () => {
    it("should retrieve user information", async () => {
      const response = await request
        .get("/users/single")
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("email");
    });
  });

  describe("POST /users/signup", () => {
    it("should create a new user", async () => {
      const response = await request
        .post("/users/signup")
        .send({ email: "newuser@example.com", password: "password123" });
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("email", "newuser@example.com");
    });
  });

  describe("POST /users/signup", () => {
    it("should create a new user", async () => {
      const response = await request
        .post("/users/signup")
        .send({ email: "newuser@example.com", password: "password123" });
      expect(response.status).to.equal(500);
    });
  });

  describe("POST /users/signin", () => {
    it("should not sign in user with incorrect password", async () => {
      const response = await request
        .post("/users/signup")
        .send({ email: "newuser@example.com", password: "wrongpassword" });
      expect(response.status).to.equal(500);
      console.log(response.status);
    });
  });

  describe("DELETE /users/", () => {
    it("should delete authenticated user", async () => {
      const response = await request
        .post("/users/signin")
        .send({ email: "newuser@example.com", password: "password123" });
      const token = response.body.token;
      const id = response.body.user._id;

      const deleteUserRes = await request
        .delete(`/users/${id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.user).to.have.property(
        "_id",
        deleteUserRes.body._id
      );
      expect(response.body.user).to.have.property(
        "email",
        "newuser@example.com"
      );
    });
  });
});
