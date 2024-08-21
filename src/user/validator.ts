import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";

class UserValidator {
  public async create(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      firstName: Joi.string().required().messages({
        "string.base": "First name must be text",
        "any.required": "First name is required.",
      }),
      lastName: Joi.string().required().messages({
        "string.base": "Last name must be text",
        "any.required": "Last name is required.",
      }),
      phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Phone number must be between 10 and 15 digits.",
          "string.base": "Phone number must be a string of digits.",
          "any.required": "Phone number is required.",
        }),
    });
    const { error } = schema.validate(req.query);

    if (!error) {
      return next();
    } else {
      return res.status(400).json({
        message: MessageResponse.Error,
        description: error.details[0].message,
        data: null,
      });
    }
  }
}

export const userValidator = new UserValidator();
