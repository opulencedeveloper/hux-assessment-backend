import request from "supertest";
import { app } from "../app";
import mongoose from "mongoose";
import User from "../src/user/entity";

describe("Auth API", () => {
  // This hook clears the user collection to ensure a clean state for each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // This hook closes the MongoDB connection to clean up resources
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/signup").send({
      userName: "testuser",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body).toHaveProperty("message", "User registration successful.");
  });

  it("should not allow registration with an existing username", async () => {
    // First, register the user
    await request(app).post("/api/v1/signup").send({
      userName: "testuser",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    // Then, attempt to sign in with the registered user's credentials
    const res = await request(app).post("/api/v1/signup").send({
      userName: "testuser",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Username is taken.");
  });

  it("should authenticate an existing user", async () => {
    const res2 = await request(app).post("/api/v1/signup").send({
      userName: "testuser",
      password: "Password123!",
      confirmPassword: "Password123!",
    });

    const res = await request(app).post("/api/v1/signin").send({
      userName: "testuser",
      password: "Password123!",
    });

    console.log("Response body", res.body, res2.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("token");
  });

  it("should not authenticate with wrong credentials", async () => {
    // Attempt to sign in with incorrect user credentials
    const res = await request(app).post("/api/v1/signin").send({
      userName: "wronguser",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Wrong user credentials!");
  });
});
