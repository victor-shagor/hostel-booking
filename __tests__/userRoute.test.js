/* eslint-disable no-undef */
import "core-js/stable";
import "regenerator-runtime/runtime";
import request from "supertest";
import app from "../app";

describe("users", () => {
  it("should create a new user", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        email: "ojoabiolav@gmail.com",
        password: "olamidee"
      });
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should create not a new user without the required field", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        password: "olamidee"
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should throw error for already created user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        email: "ojoabiola@gmail.com",
        password: "olamidee"
      });
    expect(res.status).toEqual(409);
    expect(res.body).toHaveProperty("error");
  });
  it("should sign in without the required field", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        password: "olamidee"
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not signin with wrong credentials", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "ojoabiola@gmail.com",
        password: "olamid"
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Email or password is incorrect");
    done();
  });

  it("should signin a user", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "ojoabiolav@gmail.com",
        password: "olamidee"
      });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    done();
  });
});
