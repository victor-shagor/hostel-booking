import Joi from "@hapi/joi";
import pool from "../model";
import Helper from "../Helpers/helpers";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashpassword = Helper.hashPassword(password);
  const is_admin = false;
  const checkUser = await pool.query("SELECT * FROM users WHERE email = $1 ", [
    email
  ]);
  if (checkUser.rows[0]) {
    return res.status(409).json({
      status: 409,
      error: "Email already exist, kindly procced to signin"
    });
  }
  const createNewUser = await pool.query(
    "INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) RETURNING *",
    [email, hashpassword, is_admin]
  );
  const { id, email: newEmail } = createNewUser.rows[0];
  const data = {
    id,
    newEmail,
    token: Helper.generateToken(id, newEmail, is_admin)
  };
  return res.status(201).json({
    status: 201,
    data
  });
};

export const signin = (req, res) => {
  const { email, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE email = $1 ",
    [email],
    (error, result) => {
      if (
        !result.rows[0] ||
        !Helper.comparePassword(result.rows[0].password, password)
      ) {
        return res.status(400).json({
          status: 400,
          error: "Email or password is incorrect"
        });
      }
      const { id, email, is_admin } = result.rows[0];
      const data = {
        id,
        email,
        token: Helper.generateToken(id, email, is_admin)
      };
      return res.status(200).json({
        status: 200,
        data
      });
    }
  );
};
