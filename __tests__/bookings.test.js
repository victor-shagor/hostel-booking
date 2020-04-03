/* eslint-disable no-undef */
import "core-js/stable";
import "regenerator-runtime/runtime";
import request from "supertest";
import app from "../app";

describe("check available rooms", () => {
  it("should chech for avilable rooms", async (done) => {
    const res = await request(app).get("/api/v1/checkrooms").send({
      noOfGuest: 4,
      checkInDate: "2020-05-01",
      checkOutDate: "2020-05-03",
    });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should not check for avilable rooms with the requored fields", async (done) => {
    const res = await request(app).get("/api/v1/checkrooms").send({
      checkInDate: "2020-05-01",
      checkOutDate: "2020-05-03",
    });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("date format must be in iso", async (done) => {
    const res = await request(app).get("/api/v1/checkrooms").send({
      noOfGuest: 4,
      checkInDate: "01-12-2020",
      checkOutDate: "2020-04-03",
    });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
});

describe("book available rooms", () => {
  let token;
  it("should signin a user to save token", async (done) => {
    const res = await request(app).post("/api/v1/auth/signin").send({
      email: "ojoabiolav@gmail.com",
      password: "olamidee",
    });
    token = res.body.data.token;
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should book avilable room", async (done) => {
    const res = await request(app)
      .post("/api/v1/bookroom/2")
      .set({
        token: token,
      })
      .send({
        noOfGuest: 4,
        checkInDate: "2020-05-01",
        checkOutDate: "2020-05-03",
      });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");
    done();
  });
  it("should not book avilable room", async (done) => {
    const res = await request(app)
      .post("/api/v1/bookroom/3454")
      .set({
        token: token,
      })
      .send({
        noOfGuest: 4,
        checkInDate: "2020-05-01",
        checkOutDate: "2020-05-03",
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not book avilable room without a valid token", async (done) => {
    const res = await request(app)
      .post("/api/v1/bookroom/2")
      .set({
        token: "hgjklnb54678",
      })
      .send({
        noOfGuest: 4,
        checkInDate: "2020-05-01",
        checkOutDate: "2020-05-03",
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not book avilable room without a token", async (done) => {
    const res = await request(app).post("/api/v1/bookroom/2").send({
      noOfGuest: 4,
      checkInDate: "2020-05-01",
      checkOutDate: "2020-05-03",
    });
    expect(res.status).toEqual(401);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("should not book room without required fields", async (done) => {
    const res = await request(app)
      .post("/api/v1/bookroom/2")
      .set({
        token: token,
      })
      .send({
        checkInDate: "2020-05-01",
        checkOutDate: "2020-05-03",
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("date format must be in iso", async (done) => {
    const res = await request(app)
      .post("/api/v1/bookroom/2")
      .set({
        token: token,
      })
      .send({
        noOfGuest: 4,
        checkInDate: "01-12-2020",
        checkOutDate: "2020-04-03",
      });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error");
    done();
  });
  it("view bookings", async (done) => {
    const res = await request(app).get("/api/v1/viewbookings/1");
    expect(res.status).toEqual(200);
    done();
  });
});
