"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils");
const validator_1 = require("./validator");
const controller_1 = require("./controller");
const is_auth_1 = require("../middleware/is_auth");
exports.ContactRouter = (0, express_1.Router)();
exports.ContactRouter.post("/contact", [is_auth_1.isAuth, validator_1.contactValidator.createContact], (0, utils_1.wrapAsync)(controller_1.contactController.createContact));
exports.ContactRouter.get("/contacts", [is_auth_1.isAuth], (0, utils_1.wrapAsync)(controller_1.contactController.retriveContacts));
exports.ContactRouter.get("/contact/:contactId", [is_auth_1.isAuth, validator_1.contactValidator.validateContactIdParams], (0, utils_1.wrapAsync)(controller_1.contactController.retriveContact));
exports.ContactRouter.patch("/contact/:contactId", [is_auth_1.isAuth, validator_1.contactValidator.editContact], (0, utils_1.wrapAsync)(controller_1.contactController.editContact));
exports.ContactRouter.delete("/contact/:contactId", [is_auth_1.isAuth, validator_1.contactValidator.validateContactIdParams], (0, utils_1.wrapAsync)(controller_1.contactController.deleteContact));
