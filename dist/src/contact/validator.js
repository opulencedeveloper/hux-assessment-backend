"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../utils/enum");
class ContactValidator {
    createContact(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().required().messages({
                    "string.base": "First name must be text",
                    "any.required": "First name is required.",
                }),
                lastName: joi_1.default.string().required().messages({
                    "string.base": "Last name must be text",
                    "any.required": "Last name is required.",
                }),
                phoneNumber: joi_1.default.string()
                    .pattern(/^[0-9]{10,15}$/)
                    .required()
                    .messages({
                    "string.pattern.base": "Phone number must be between 10 and 15 digits.",
                    "string.base": "Phone number must be a string of digits.",
                    "any.required": "Phone number is required.",
                }),
            });
            const { error } = schema.validate(req.body);
            if (!error) {
                return next();
            }
            else {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: error.details[0].message,
                    data: null,
                });
            }
        });
    }
    editContact(req, res, next) {
        const paramsSchema = joi_1.default.object({
            contactId: joi_1.default.string()
                .custom((value, helpers) => {
                if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
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
        const bodySchema = joi_1.default.object({
            firstName: joi_1.default.string().required().messages({
                "string.base": "First name must be text",
                "any.required": "First name is required.",
            }),
            lastName: joi_1.default.string().required().messages({
                "string.base": "Last name must be text",
                "any.required": "Last name is required.",
            }),
            phoneNumber: joi_1.default.string()
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
                status: enum_1.MessageResponse.Error,
                message: paramsError.details[0].message,
                data: null,
            });
        }
        const { error: bodyError } = bodySchema.validate(req.body);
        if (bodyError) {
            return res.status(400).json({
                status: enum_1.MessageResponse.Error,
                message: bodyError.details[0].message,
                data: null,
            });
        }
        return next();
    }
    validateContactIdParams(req, res, next) {
        const schema = joi_1.default.object({
            contactId: joi_1.default.string()
                .custom((value, helpers) => {
                if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
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
        }
        else {
            return res.status(400).json({
                status: enum_1.MessageResponse.Error,
                message: error.details[0].message,
                data: null,
            });
        }
    }
}
exports.contactValidator = new ContactValidator();
