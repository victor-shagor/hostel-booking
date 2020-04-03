import Joi from "@hapi/joi";

export const roomValidate = (req, res, next) => {
  const { type, numberOfBed } = req.body;
  const schema = Joi.object({
    type: Joi.string()
      .required()
      .trim(),

    numberOfBed: Joi.number().required()
  });

  const { error, value } = schema.validate({ type, numberOfBed });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (
    (value.type.toLowerCase() !== "mixed dorm room" ||
      (value.numberOfBed !== 4 && value.numberOfBed !== 8)) &&
    (value.type.toLowerCase() !== "dorm room" || value.numberOfBed !== 4) &&
    (value.type.toLowerCase() !== "deluxe room" || value.numberOfBed !== 1) &&
    (value.type.toLowerCase() !== "standard double room" ||
      value.numberOfBed !== 2)
  ) {
    return res.status(400).json({
      error:
        "type can only be one of the following (mixed dorm room: 4 or 8 beds, dorm room: 4 beds, deluxe room: 1 bed, standard double room: 2 beds)"
    });
  }
  next();
};
