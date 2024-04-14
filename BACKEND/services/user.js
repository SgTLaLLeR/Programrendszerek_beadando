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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("./zod");
const user_login_1 = require("../dtos/user-login");
const user_not_found_1 = require("../errors/user-not-found");
const prisma = new client_1.PrismaClient();
function loginUser(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.users.findFirst({
            where: {
                name: userInput.name,
                password: userInput.pw
            }
        });
        if (!user) {
            throw new user_not_found_1.UserNotFound(userInput.name);
        }
        return (0, zod_1.zParse)(user_login_1.UserLoginDTOSucces, {
            message: 'Login Success',
        });
    });
}
exports.loginUser = loginUser;
function registerUser(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.users.create({
            data: {
                email: userInput.email,
                name: userInput.name,
                password: userInput.pw,
            }
        });
        return (0, zod_1.zParse)(user_login_1.UserLoginDTOSucces, {
            message: 'Register Success',
        });
    });
}
exports.registerUser = registerUser;
