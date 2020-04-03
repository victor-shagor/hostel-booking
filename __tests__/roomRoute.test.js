/* eslint-disable no-undef */
import "core-js/stable";
import "regenerator-runtime/runtime";
import request from "supertest";
import app from "../app";

describe("create rooms for booking", () => {
  let usertoken;
  let admintoken;
  it("should signin a user to save token", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "ojoabiola@gmail.com",
        password: "oladimeji"
      });
    admintoken = res.body.data.token;
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should signin a user to save token", async done => {
    const res = await request(app)
      .post("/api/v1/auth/signin")
      .send({
        email: "ojoabiolav@gmail.com",
        password: "olamidee"
      });
    usertoken = res.body.data.token;
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should not create a room without required fields", async done => {
    const res = await request(app)
      .post("/api/v1/room")
      .set({
        token: admintoken
      })
      .send({
        numberOfBed: 4
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not create a room with an invalid type", async done => {
    const res = await request(app)
      .post("/api/v1/room")
      .set({
        token: admintoken
      })
      .send({
        type: "dorm roomsde",
        numberOfBed: 4
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });

  it("should create a room", async done => {
    const res = await request(app)
      .post("/api/v1/room")
      .set({
        token: admintoken
      })
      .send({
        type: "dorm room",
        numberOfBed: 4
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should not create a room without token", async done => {
    const res = await request(app)
      .post("/api/v1/room")
      .send({
        type: "dorm room",
        numberOfBed: 4
      });
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not create a room without a valid token", async done => {
    const res = await request(app)
      .post("/api/v1/room")
      .set({
        token: "heehhgyehje"
      })
      .send({
        type: "dorm room",
        numberOfBed: 4
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not create a room with a user token", async done => {
    const res = await request(app)
      .post("/api/v1/room")
      .set({
        token: usertoken
      })
      .send({
        type: "dorm room",
        numberOfBed: 4
      });
    expect(res.status).toEqual(403);
    expect(res.body).toHaveProperty("error");
    done();
  });
});
