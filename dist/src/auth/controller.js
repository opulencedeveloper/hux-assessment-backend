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
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../utils/auth");
const enum_1 = require("../utils/enum");
const service_1 = require("../user/service");
const service_2 = require("./service");
dotenv_1.default.config();
class AuthController {
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userExists = yield service_1.userService.findUserByUserName(body.userName);
            if (userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Username is taken.",
                    data: null,
                });
            }
            yield service_2.authService.createUser(body);
            return res.status(201).json({
                status: enum_1.MessageResponse.Success,
                message: "User registration successful.",
                data: null,
            });
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const userName = body.userName;
            const password = body.password;
            const userExists = yield service_1.userService.findUserByUserName(userName);
            console.log(userExists);
            if (!userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Wrong user credentials!",
                    data: null,
                });
            }
            const existingPassword = userExists.password;
            const existingUserId = userExists._id;
            const match = yield (0, auth_1.comparePassword)(password, existingPassword);
            if (!match) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Wrong user credentials!99999",
                    data: null,
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: existingUserId }, process.env.JWT_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRY,
            });
            return res.status(200).json({
                status: enum_1.MessageResponse.Success,
                message: "Logged in successfully",
                data: { token },
            });
        });
    }
}
exports.authController = new AuthController();
