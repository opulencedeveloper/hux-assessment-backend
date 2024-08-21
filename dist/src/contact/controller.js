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
exports.contactController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const enum_1 = require("../utils/enum");
const service_1 = require("../user/service");
const service_2 = require("./service");
dotenv_1.default.config();
class ContactController {
    createContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { userId } = req;
            const userExists = yield service_1.userService.findUserById(userId);
            if (!userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Invalid user.",
                    data: null,
                });
            }
            const newContact = yield service_2.contactService.createContact(body, userId);
            return res.status(201).json({
                status: enum_1.MessageResponse.Success,
                message: "Contact creation complete.",
                data: newContact,
            });
        });
    }
    retriveContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const userExists = yield service_1.userService.findUserById(userId);
            if (!userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Invalid user.",
                    data: null,
                });
            }
            const contacts = yield service_2.contactService.fetchContactsByCreatorId(userId);
            return res.status(200).json({
                status: enum_1.MessageResponse.Success,
                message: "Contacts fetched successfully.",
                data: contacts,
            });
        });
    }
    retriveContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const userExists = yield service_1.userService.findUserById(userId);
            if (!userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Invalid user.",
                    data: null,
                });
            }
            const contact = yield service_2.contactService.fetchContactByCreatorId(userId);
            return res.status(200).json({
                status: enum_1.MessageResponse.Success,
                message: "Contact fetched successfully.",
                data: contact,
            });
        });
    }
    editContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { contactId } = req.params;
            const { userId } = req;
            const userExists = yield service_1.userService.findUserById(userId);
            if (!userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Invalid user.",
                    data: null,
                });
            }
            const updatedContact = yield service_2.contactService.editContact(body, contactId);
            if (!updatedContact) {
                return res.status(404).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Contact not found.",
                    data: null,
                });
            }
            return res.status(201).json({
                status: enum_1.MessageResponse.Success,
                message: "Contact edited successfully.",
                data: updatedContact,
            });
        });
    }
    deleteContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { contactId } = req.params;
            const { userId } = req;
            const userExists = yield service_1.userService.findUserById(userId);
            if (!userExists) {
                return res.status(400).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Invalid user.",
                    data: null,
                });
            }
            const deletedContact = yield service_2.contactService.deleteContact(contactId);
            if (!deletedContact) {
                return res.status(404).json({
                    status: enum_1.MessageResponse.Error,
                    message: "Contact not found.",
                    data: null,
                });
            }
            return res.status(201).json({
                status: enum_1.MessageResponse.Success,
                message: "Contact deleted successfully.",
                data: null,
            });
        });
    }
}
exports.contactController = new ContactController();
