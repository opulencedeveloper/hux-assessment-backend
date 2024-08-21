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
exports.db = exports.clearDB = exports.disconnectDB = exports.connectDB = void 0;
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
let mongoServer;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    //provides an in memory MongoDB server which is good for test.
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    yield mongoose_1.default.connect(uri);
    return mongoose_1.default.connection;
});
exports.connectDB = connectDB;
const disconnectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
});
exports.disconnectDB = disconnectDB;
const clearDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        yield collection.deleteMany({});
    }
});
exports.clearDB = clearDB;
// Establish a database connection before running tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.connectDB)();
}));
// Close the database connection and server after tests are complete
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.disconnectDB)();
    app_1.server.close();
}));
// Clear the database between test runs
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.clearDB)();
}));
// Export the database connection for use in tests if needed
exports.db = mongoose_1.default.connection;
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';
// import { server } from './app';
// let mongoServer: MongoMemoryServer;
// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri);
// });
// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
//   server.close();
// });
// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany({});
//   }
// });
