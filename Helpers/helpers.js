/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable camelcase */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  generateToken(id, email, is_admin) {
    const token = jwt.sign(
      {
        id,
        email,
        is_admin
      },
      process.env.SECRET,
      { expiresIn: "7d" }
    );
    return token;
  },
  adminNotifacation(req, user, admin_id, room_id) {
    const message = `Hello admin, ${user} booked room with room_id:${room_id}`;
    const isEmitted = req.io.emit(admin_id, message);

    if (isEmitted) return true;
    return false;
  }
};

export default Helper;
