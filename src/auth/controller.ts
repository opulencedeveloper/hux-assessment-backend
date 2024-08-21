import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { comparePassword } from "../utils/auth";
import { MessageResponse } from "../utils/enum";
import { userService } from "../user/service";
import { authService } from "./service";
import { IUserInput } from "../user/interface";

dotenv.config();

class AuthController {
  public async signUp(req: Request, res: Response) {
    const body: IUserInput = req.body;

    const userExists = await userService.findUserByUserName(body.userName);

    if (userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Username is taken.",
        data: null,
      });
    }

    await authService.createUser(body);

    return res.status(201).json({
      status: MessageResponse.Success,
      message: "User registration successful.",
      data: null,
    });
  }

  public async signIn(req: Request, res: Response) {
    const body: IUserInput = req.body;

    const userName = body.userName;

    const password = body.password;

    const userExists = await userService.findUserByUserName(userName);

    console.log(userExists);

    if (!userExists) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Wrong user credentials!",
        data: null,
      });
    }

    const existingPassword = userExists.password;

    const existingUserId = userExists._id;

    const match = await comparePassword(password, existingPassword);

    if (!match) {
      return res.status(400).json({
        status: MessageResponse.Error,
        message: "Wrong user credentials!99999",
        data: null,
      });
    }

    const token = jwt.sign(
      { userId: existingUserId },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    return res.status(200).json({
      status: MessageResponse.Success,
      message: "Logged in successfully",
      data: { token },
    });
  }
}

export const authController = new AuthController();
