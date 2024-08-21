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
const app_1 = require("../app");
const mongoose_1 = __importDefault(require("mongoose"));
const entity_1 = __importDefault(require("../src/user/entity"));
describe("Auth API", () => {
    // This hook clears the user collection to ensure a clean state for each test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield entity_1.default.deleteMany({});
    }));
    // This hook closes the MongoDB connection to clean up resources
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it("should register a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/v1/signup").send({
            userName: "testuser",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("status", "success");
        expect(res.body).toHaveProperty("message", "User registration successful.");
    }));
    it("should not allow registration with an existing username", () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register the user
        yield (0, supertest_1.default)(app_1.app).post("/api/v1/signup").send({
            userName: "testuser",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        // Then, attempt to sign in with the registered user's credentials
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/v1/signup").send({
            userName: "testuser",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "Username is taken.");
    }));
    it("should authenticate an existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res2 = yield (0, supertest_1.default)(app_1.app).post("/api/v1/signup").send({
            userName: "testuser",
            password: "Password123!",
            confirmPassword: "Password123!",
        });
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/v1/signin").send({
            userName: "testuser",
            password: "Password123!",
        });
        console.log("Response body", res.body, res2.body);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("status", "success");
        expect(res.body.data).toHaveProperty("token");
    }));
    it("should not authenticate with wrong credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        // Attempt to sign in with incorrect user credentials
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/v1/signin").send({
            userName: "wronguser",
            password: "wrongpassword",
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("status", "error");
        expect(res.body).toHaveProperty("message", "Wrong user credentials!");
    }));
});
