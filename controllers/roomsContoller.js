import pool from "../model";
import Helper from "../Helpers/helpers";

export const createRoom = (req, res) => {
  const { type, numberOfBed } = req.body;
  pool.query(
    "INSERT INTO rooms (type, number_of_beds, status) VALUES ($1, $2, $3) RETURNING *",
    [type, numberOfBed, "available"],
    (error, results) => {
      const { id, type, number_of_beds, status } = results.rows[0];
      const data = {
        id,
        type,
        number_of_beds,
        status
      };
      return res.status(201).json({
        status: 201,
        data
      });
    }
  );
};
