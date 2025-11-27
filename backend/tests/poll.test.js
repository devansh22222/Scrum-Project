
const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Poll = require("../models/pollModel");

let cookie;

beforeAll(async () => {
  const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/auth_test";
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoose.connection.db.dropDatabase();


  await request(app).post("/api/auth/register").send({ name: "P", age: 30, email: "p@x.com", password: "123456" });
  const res = await request(app).post("/api/auth/login").send({ email: "p@x.com", password: "123456" });
  cookie = res.headers["set-cookie"];
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Poll APIs", () => {
  test("create poll (public) should succeed", async () => {
    const payload = {
      type: "poll",
      question: "Favorite color?",
      options: [{ text: "Red" }, { text: "Blue" }],
      allowMultiple: false,
      anonymous: false,
      accessType: "public",
      startTime: new Date(Date.now() - 1000).toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    };
    const res = await request(app).post("/api/polls/create").set("Cookie", cookie).send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pollId).toBeDefined();
  });

  test("submit vote should succeed then not allow double voting", async () => {
    const poll = await Poll.findOne({ question: /Favorite color/ });
    const optionId = poll.options[0]._id;

    const res1 = await request(app).post(`/api/polls/${poll._id}/vote`).set("Cookie", cookie).send({ choices: [optionId.toString()] });
    expect(res1.statusCode).toBe(200);
    expect(res1.body.success).toBe(true);

    const res2 = await request(app).post(`/api/polls/${poll._id}/vote`).set("Cookie", cookie).send({ choices: [optionId.toString()] });
    expect(res2.statusCode).toBe(400);
    expect(res2.body.success).toBe(false);
  });

  test("get results should be allowed for creator before close", async () => {
    const poll = await Poll.findOne({ question: /Favorite color/ });
    const res = await request(app).get(`/api/polls/${poll._id}/results`).set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.options).toBeDefined();
  });
});
