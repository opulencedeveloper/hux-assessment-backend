import { Router } from "express";

import { wrapAsync } from "../utils";
import { contactValidator } from "./validator";
import { contactController } from "./controller";
import { isAuth } from "../middleware/is_auth";

export const ContactRouter = Router();

ContactRouter.post(
  "/contact",
  [isAuth, contactValidator.createContact],
  wrapAsync(contactController.createContact)
);

ContactRouter.get(
  "/contacts",
  [isAuth],
  wrapAsync(contactController.retriveContacts)
);

ContactRouter.get(
  "/contact/:contactId",
  [isAuth, contactValidator.validateContactIdParams],
  wrapAsync(contactController.retriveContact)
);

ContactRouter.patch(
  "/contact/:contactId",
  [isAuth, contactValidator.editContact],
  wrapAsync(contactController.editContact)
);

ContactRouter.delete(
  "/contact/:contactId",
  [isAuth, contactValidator.validateContactIdParams],
  wrapAsync(contactController.deleteContact)
);
