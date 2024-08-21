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
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const enum_1 = require("../utils/enum");
dotenv_1.default.config();
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get("Authorization");
    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(401).json({
            status: enum_1.MessageResponse.Error,
            message: "Not authenticated. Authorization header missing.",
            data: null,
        });
    }
    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];
    try {
        if (!token) {
            throw new Error("Token missing");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                status: enum_1.MessageResponse.Error,
                message: "Not authenticated. Invalid token.",
                data: null,
            });
        }
        // Attach the user ID to the request object
        req.userId = decodedToken.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({
            status: enum_1.MessageResponse.Error,
            message: "Not authenticated. Token verification failed.",
            data: null,
        });
    }
});
exports.isAuth = isAuth;
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import { CustomRequest, DecodedToken } from "../utils/interface";
// import { MessageResponse } from "../utils/enum";
// dotenv.config();
// export const isAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.get("Authorization");
//   if (!authHeader) {
//     return res.status(401).json({
//       status: MessageResponse.Error,
//       message: "Not authenticated1",
//       data: null,
//     });
//   }
//   const token = authHeader.split(" ")[1];
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
//   } catch (err) {
//     return res.status(401).json({
//       status: MessageResponse.Error,
//       message: "Not authenticated2",
//       data: null,
//     });
//   }
//   if (!decodedToken) {
//     return res.status(401).json({
//       status: MessageResponse.Error,
//       message: "Not authenticated",
//       data: null,
//     });
//   }
//   (req as CustomRequest).userId = decodedToken.userId;
//   next();
// };
