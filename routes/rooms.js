import express from "express";
import { createRoom } from "../controllers/roomsContoller";
import { roomValidate } from "../Middleware/roomValidation";
import Auth from "../Middleware/auth";

const roomRouter = express.Router();

roomRouter
  .route("/api/v1/room")
  .post(Auth.verifyAdmin, roomValidate, createRoom);

export default roomRouter;
