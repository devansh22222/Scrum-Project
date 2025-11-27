
const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/userModel");

beforeAll(async () => {
  
  const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/auth_test";
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe("Auth API", () => {
  const user = { name: "Test User", age: 25, email: "test@example.com", password: "pass1234" };

  test("register should create user and set cookie", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const cookie = res.headers["set-cookie"];
    expect(cookie).toBeDefined();
    const dbUser = await User.findOne({ email: user.email });
    expect(dbUser).not.toBeNull();
  });

  test("login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("login with wrong password fails", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: user.email, password: "wrong" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(false);
  });
});
