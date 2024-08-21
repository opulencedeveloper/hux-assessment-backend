import Joi from "joi";
import { Request, Response, NextFunction } from "express";

import { MessageResponse } from "../utils/enum";

class AuthValidator {
  public async signUp(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      userName: Joi.string().required().messages({
        "string.base": "User name must be text",
        "any.required": "User name is required.",
      }),
      password: Joi.string().min(8).required().messages({
        "any.required": "Password is required.",
        "string.min": "Password must be at least 8 characters long",
      }),
      confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.required": "Confirm Password is required.",
          "any.only": "Passwords do not match",
        }),
    });

    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: error.details[0].message,
        data: null,
      });
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      userName: Joi.string().required().messages({
        "string.base": "User name must be text",
        "any.required": "User name is required.",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required.",
      }),
    });

    const { error } = schema.validate(req.body);

    if (!error) {
      return next();
    } else {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: error.details[0].message,
        data: null,
      });
    }
  }
}

export const authValidator = new AuthValidator();
