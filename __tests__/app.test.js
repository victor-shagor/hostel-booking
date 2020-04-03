import "core-js/stable";
import "regenerator-runtime/runtime";
import request from "supertest";
import app from "../app";

describe("Root route", () => {
  it("should display welcome", async (done) => {
    const res = await request(app).get("/");
    expect(res.body.message).toEqual("Welcome to Hostel bookings");
    expect(res.status).toEqual(200);
    done();
  });
  it("should display route not found", async (done) => {
    const res = await request(app).get("/invalid/route");
    expect(res.body.message).toEqual("route not found");
    expect(res.status).toEqual(404);
    done();
  });
});
