const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require('../../models/user');

describe("/tokens", () => {

  beforeAll( () => {
    const user = new User({ email: "test@test.com", password: "12345678", firstName: "First", lastName: "Last", userDob: "2002-10-10" })
    user.save()
  });

  afterAll( async () => {
    await User.deleteMany({})
  })

  test("a token is returned when creds are valid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({email: "test@test.com", password: "12345678"})
    expect(response.body.message).toEqual("OK")
    expect(response.status).toEqual(201)
    expect(response.body.token).not.toEqual(undefined)
  })


  test("a token is not returned when creds are invalid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({email: "test@test.com", password: "1234"})
    expect(response.status).toEqual(401)
    expect(response.body.token).toEqual(undefined)
    expect(response.body.message).toEqual("auth error")
  })
})