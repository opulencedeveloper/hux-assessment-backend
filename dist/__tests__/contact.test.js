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
const supertest_1 = __importDefault(require("supertest"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const service_1 = require("../src/contact/service");
const enum_1 = require("../src/utils/enum");
const service_2 = require("../src/user/service");
const entity_1 = __importDefault(require("../src/contact/entity"));
const entity_2 = __importDefault(require("../src/user/entity"));
dotenv_1.default.config();
// Mocking the contact service and user services
jest.mock("../src/contact/service");
jest.mock("../src/user/service");
// Mocking the authentication middleware to attach userId to req
jest.mock("../src/middleware/is_auth", () => {
    return (req, res, next) => {
        req.userId = mockUserId;
        next();
    };
});
// Mocking the contact service and user service modules
const mockUserId = "66b12b4acb224570281d51de";
// Defining a mock user object to be used in tests
const mockUser = {
    _id: mockUserId,
    userName: "testUser",
    password: "$2b$12$IQigcjCXZKMRqXa69NCAr.xKynsd64N9HkqZsG7liN8zTtvl2Vl6C",
};
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    //Clear mock implementations and calls
    jest.clearAllMocks();
    // Clear the Contact collection to ensure a clean state
    yield entity_1.default.deleteMany({});
    // Clear the User collection to ensure a clean state
    yield entity_2.default.deleteMany({});
    // Insert the mock user into the database
    yield entity_2.default.create(mockUser);
}));
describe("Contact API", () => {
    const mockContactId = "66ab1e3c80c29e19231ded23";
    // Creating a JWT token for authentication in tests
    const token = jsonwebtoken_1.default.sign({ userId: mockUserId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    // Defining a mock contact object for use in tests
    const mockContact = {
        _id: mockContactId,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        creatorId: mockUserId,
    };
    beforeEach(() => {
        jest.clearAllMocks();
        service_2.userService.findUserById.mockReturnValue(Promise.resolve(mockUser));
    });
    it("should create a new contact", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/v1/contact")
            .set("Authorization", `Bearer ${token}`)
            .send({
            firstName: "John",
            lastName: "Doe",
            phoneNumber: "1234567890",
        });
        expect(response.status).toBe(201);
        expect(response.body.status).toBe(enum_1.MessageResponse.Success);
    }));
    it("should retrieve all contacts for the user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield entity_1.default.create(mockContact);
        service_1.contactService.fetchContactsByCreatorId.mockResolvedValue([
            mockContact,
        ]);
        const response = yield (0, supertest_1.default)(app_1.app)
            .get("/api/v1/contacts")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(enum_1.MessageResponse.Success);
    }));
    it("should retrieve a single contact by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        service_1.contactService.fetchContactByCreatorId.mockResolvedValue(mockContact);
        const response = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/v1/contact/${mockContactId}`)
            .set("Authorization", `Bearer ${token}`);
        console.log("Response3", response.body);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(enum_1.MessageResponse.Success);
    }));
    it("should update an existing contact", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedContact = Object.assign(Object.assign({}, mockContact), { firstName: "Jane" });
        yield entity_1.default.create(updatedContact);
        service_1.contactService.editContact.mockResolvedValue(updatedContact);
        const response = yield (0, supertest_1.default)(app_1.app)
            .patch(`/api/v1/contact/${mockContactId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
            firstName: "Jane",
            lastName: "Doe",
            phoneNumber: "1234567890",
        });
        console.log("Response4", response.body);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe(enum_1.MessageResponse.Success);
        expect(response.body.data).toMatchObject(updatedContact);
    }));
    it("should delete a contact", () => __awaiter(void 0, void 0, void 0, function* () {
        yield entity_1.default.create(mockContact);
        service_1.contactService.deleteContact.mockResolvedValue(mockContact);
        const response = yield (0, supertest_1.default)(app_1.app)
            .delete(`/api/v1/contact/${mockContactId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(201);
        expect(response.body.status).toBe(enum_1.MessageResponse.Success);
        expect(response.body.data).toBeNull();
    }));
    it("should return 404 if contact to be deleted is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock the deleteContact function to return null (indicating no contact found)
        service_1.contactService.deleteContact.mockResolvedValue(null);
        const response = yield (0, supertest_1.default)(app_1.app)
            .delete(`/api/v1/contact/${mockContactId}`)
            .set("Authorization", `Bearer ${token}`);
        console.log("Response6", response.body);
        expect(response.status).toBe(404);
        expect(response.body.status).toBe(enum_1.MessageResponse.Error);
        expect(response.body.message).toBe("Contact not found.");
    }));
});
