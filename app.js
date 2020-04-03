import bodyParser from "body-parser";
import cors from "cors";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import socketIo from "socket.io";

import userRouter from "./routes/users";
import roomRouter from "./routes/rooms";
import bookRouter from "./routes/booking";
import "core-js/stable";
import "regenerator-runtime/runtime";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});

const io = socketIo(server);
io.on("connection", socket => {
  if (process.env.NODE_ENV === "development") {
    console.info(`${socket.id} connected`);
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// app.use("/", indexRouter);
app.use("/", userRouter);
app.use("/", roomRouter);
app.use("/", bookRouter);
app.get("/", (req, res) =>
  res.status(200).send({ message: "Welcome to Hostel bookings" })
);
app.use("*", (req, res) =>
  res.status(404).send({ message: "route not found" })
);
// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
