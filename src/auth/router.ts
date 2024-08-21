import { Router } from "express";

import { authController } from "./controller";
import { wrapAsync } from "../utils";
import { authValidator } from "./validator";

export const AuthRouter = Router();


AuthRouter.post(
  "/signup",
  [authValidator.signUp],
  wrapAsync(authController.signUp)
);

AuthRouter.post(
  "/signin",
  [authValidator.signIn],
  wrapAsync(authController.signIn)
);


