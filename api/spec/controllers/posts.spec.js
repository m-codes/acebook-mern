const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const Post = require("../../models/post");
const User = require("../../models/user");
const TokenGenerator = require("../../models/token_generator");
const JWT = require("jsonwebtoken");
let token;

describe("/posts", () => {
  beforeAll(async () => {
    const user = new User({
      email: "test@test.com",
      password: "12345678",
      firstName: "First",
      lastName: "Last",
      userDob: "2002-10-10",
    });
    await user.save();
    token = await TokenGenerator.jsonwebtoken(user.id);
  });

  beforeEach(async () => {
    await Post.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("POST, when token is present", () => {
    test("responds with a 201", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("hello world");
    });

    test("returns a new token", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);

      expect(newPayload.iat >= originalPayload.iat).toEqual(true);
    });

    test("returns an update list of posts", async () => {
      let response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world", token: token });
      expect(response.body.posts[0].message).toEqual("hello world");
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      await request(app).post("/posts").send({ message: "hello again world" });
      let posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      let response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });
      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("returns every post in the collection", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      let messages = response.body.posts.map((post) => post.message);
      expect(messages).toContain("howdy!");
      expect(messages).toContain("hola!");
    });

    test("the response code is 200", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      expect(response.status).toEqual(200);
    });

    test("returns a new token", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token });
      let newPayload = JWT.decode(response.body.token, process.env.JWT_SECRET);
      let originalPayload = JWT.decode(token, process.env.JWT_SECRET);
      expect(newPayload.iat >= originalPayload.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("returns no posts", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app).get("/posts");
      expect(response.body.posts).toEqual(undefined);
    });

    test("the response code is 401", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app).get("/posts");
      expect(response.status).toEqual(401);
    });

    test("does not return a new token", async () => {
      let post1 = new Post({ message: "howdy!" });
      let post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();
      let response = await request(app).get("/posts");
      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("POST /:id, when a token is present", () => {
    it("Adds comment to the post", async () => {
      let post = new Post({ message: "howdy!" });
      await post.save();
     
      await request(app)
        .post(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token, message: "a comment" });

      const posts = await Post.find();
      expect(posts[0].comments[0]).toMatchObject({
        message: "a comment",
      });
    });

    it("Returns a 201 status response", async () => {
      let post = new Post({ message: "howdy!" });
      await post.save();
     
      let response = await request(app)
        .post(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token, message: "a comment" });

        expect(response.status).toEqual(201);
    });

    it("Returns a token", async () => {
      let post = new Post({ message: "howdy!" });
      await post.save();
     
      let response = await request(app)
        .post(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token, message: "a comment" });

      expect(response.body.token).toEqual(expect.any(String));
    });

    it("Response returns updated list of posts", async () => {
      let post = new Post({ message: "howdy!" });
      await post.save();
     
      let response = await request(app)
        .post(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ token: token, message: "a comment" });

      expect(response.body.posts[0].comments[0].message).toEqual("a comment");
    });
  });

  describe("POST /:id, when a token is missing", () => {
    it("Returns a 401 status response", async () => {
      let post = new Post({ message: "howdy!" });
      await post.save();
     
      let response = await request(app)
        .post(`/posts/${post._id}`)
        .send({ message: "a comment" });

      expect(response.status).toEqual(401);
    });
  })
});
