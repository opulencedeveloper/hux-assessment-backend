import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import { MessageResponse } from "../utils/enum";

class ContactValidator {
  public async createContact(req: Request, res: Response, next: NextFunction) {
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

  public editContact(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = Joi.object({
      contactId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message({
              custom: "Contact Id must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Contact Id must be a string",
          "any.required": "Contact Id is required",
        }),
    });

    const bodySchema = Joi.object({
      firstName: Joi.string().required().messages({
        "string.base": "First name must be text",
        "any.required": "First name is required.",
      }),
      lastName: Joi.string().required().messages({
        "string.base": "Last name must be text",
        "any.required": "Last name is required.",
      }),
      phoneNumber: Joi.string()
        .pattern(/^\d{10,15}$/)
        .required()
        .messages({
          "string.base": "Phone number must be text",
          "string.pattern.base": "Phone number must be between 10 to 15 digits",
          "any.required": "Phone number is required.",
        }),
    });

    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: paramsError.details[0].message,
        data: null,
      });
    }

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: bodyError.details[0].message,
        data: null,
      });
    }

    return next();
  }

  public validateContactIdParams(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      contactId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message({
              custom: "Contact Id must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Contact Id must be a string",
          "any.required": "Contact Id is required",
        }),
    });

    const { error } = schema.validate(req.params);

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

export const contactValidator = new ContactValidator();
