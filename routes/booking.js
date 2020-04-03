import express from "express";
import {
  checkRooms,
  booking,
  viewBookings
} from "../controllers/bookingController";
import { checkValidate, bookValidation } from "../Middleware/bookingValidation";
import Auth from "../Middleware/auth";

const bookRouter = express.Router();

bookRouter.route("/api/v1/checkrooms").get(checkValidate, checkRooms);
bookRouter
  .route("/api/v1/bookroom/:id")
  .post(Auth.verifyToken, bookValidation, booking);
bookRouter.route("/api/v1/viewbookings/:id").get(viewBookings);

export default bookRouter;
