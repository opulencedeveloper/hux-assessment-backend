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
exports.authService = void 0;
const entity_1 = __importDefault(require("../user/entity"));
const auth_1 = require("../utils/auth");
class AuthService {
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, password } = input;
            const hashedPassword = yield (0, auth_1.hashPassword)(password);
            const user = new entity_1.default({
                userName,
                password: hashedPassword
            });
            const newUser = yield user.save();
            return newUser;
        });
    }
}
exports.authService = new AuthService();
