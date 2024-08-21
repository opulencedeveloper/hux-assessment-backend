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
exports.contactService = void 0;
const entity_1 = __importDefault(require("./entity"));
class ContactService {
    createContact(input, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, phoneNumber } = input;
            const contact = new entity_1.default({
                firstName,
                lastName,
                phoneNumber,
                creatorId,
            });
            const newContact = yield contact.save();
            return newContact;
        });
    }
    fetchContactsByCreatorId(creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contacts = yield entity_1.default.find({ creatorId });
            return contacts;
        });
    }
    fetchContactByCreatorId(creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield entity_1.default.findOne({ creatorId });
            return contact;
        });
    }
    editContact(input, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, phoneNumber } = input;
            let contact = yield entity_1.default.findById(contactId);
            if (contact) {
                contact.firstName = firstName;
                contact.lastName = lastName;
                contact.phoneNumber = phoneNumber;
                contact = yield contact.save();
            }
            return contact;
        });
    }
    deleteContact(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield entity_1.default.findOneAndDelete({ _id: contactId });
            return contact;
        });
    }
}
exports.contactService = new ContactService();
