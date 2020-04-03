import Joi from "@hapi/joi";
import pool from "../model";

export const checkValidate = (req, res, next) => {
  const { noOfGuest, checkInDate, checkOutDate } = req.body;

  const schema = Joi.object({
    noOfGuest: Joi.number().required().max(8),
    checkInDate: Joi.date()
      .iso()
      .required()
      .min(new Date().toISOString().split("T")[0])
      .messages({
        "date.min": `"CheckInDate" cannot be in the past`,
        "date.iso": `"CheckInDate" can only be in 'YYYY-MM-DD' format`,
      }),
    checkOutDate: Joi.date().iso().required().messages({
      "date.min": `CheckOutDate" cannot come before CheckInDate`,
      "date.iso": `CheckOutDate" can only be in 'YYYY-MM-DD' format`,
    }),
  });
  const { error, value } = schema.validate(
    {
      noOfGuest,
      checkInDate,
      checkOutDate,
    },
    { abortEarly: true }
  );
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const bookValidation = async (req, res, next) => {
  const { noOfGuest, checkInDate, checkOutDate } = req.body;
  const { id: room_id } = req.params;
  const schema = Joi.object({
    room_id: Joi.number().required(),
    noOfGuest: Joi.number().required().max(8),
    checkInDate: Joi.date()
      .iso()
      .required()
      .min(new Date().toISOString().split("T")[0])
      .messages({
        "date.min": `"CheckInDate" cannot be in the past`,
        "date.iso": `"CheckInDate" can only be in 'YYYY-MM-DD' format`,
      }),
    checkOutDate: Joi.date().iso().required().messages({
      "date.min": `CheckOutDate" cannot come before CheckInDate`,
      "date.iso": `CheckOutDate" can only be in 'YYYY-MM-DD' format`,
    }),
  });
  const { error, value } = schema.validate({
    noOfGuest,
    checkInDate,
    checkOutDate,
    room_id,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  let data = [];
  const allRoomsid = await pool.query(
    "SELECT id FROM rooms WHERE status = $1 AND number_of_beds >= $2",
    ["available", noOfGuest]
  );
  data = allRoomsid.rows;
  const availableRoomId = await pool.query(
    "SELECT room_id FROM bookings WHERE checkout_date <= $1",
    [checkInDate]
  );
  data.push(...availableRoomId.rows);
  const check = data.some((res) => {
    if (res.room_id) {
      return res.room_id === parseInt(room_id);
    }
    if (res.id) {
      return res.id === parseInt(room_id);
    }
  });
  if (!check) {
    return res.status(400).json({
      error: `room is either not avalibale or cannot contain ${noOfGuest} guests`,
    });
  }
  next();
};
