import Joi from "joi";

export const userIdSchema = Joi.object()
  .keys({
    userId: Joi.string()
      .guid({
        version: ["uuidv4"],
      })
      .required(),
  })
  .required();
