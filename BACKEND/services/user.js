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
exports.updateUser = exports.findUserById = exports.registerHelper = exports.registerUser = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const zod_1 = require("./zod");
const user_login_1 = require("../dtos/user-login");
const user_not_found_1 = require("../errors/user-not-found");
const incorrect_password_1 = require("../errors/incorrect-password");
const email_already_exist_1 = require("../errors/email-already-exist");
const username_already_exist_1 = require("../errors/username-already-exist");
const prisma = new client_1.PrismaClient();
function loginUser(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.users.findFirst({
            where: {
                name: userInput.name,
            },
        });
        if (!user) {
            throw new user_not_found_1.UserNotFound(userInput.name);
        }
        const passwordMatch = yield bcrypt_1.default.compare(userInput.pw, user.password);
        if (!passwordMatch) {
            throw new incorrect_password_1.IncorrectPassword();
        }
        // return zParse(UserLoginDTOSucces, {
        //     message: 'Login Success',
        // });
        return user;
    });
}
exports.loginUser = loginUser;
function registerUser(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        yield registerHelper(userInput.name, userInput.email);
        const hashedPassword = yield bcrypt_1.default.hash(userInput.pw, 10); // 10 a salt rounds
        const user = yield prisma.users.create({
            data: {
                email: userInput.email,
                name: userInput.name,
                password: hashedPassword,
            }
        });
        return (0, zod_1.zParse)(user_login_1.UserLoginDTOSucces, {
            message: 'Register Success',
        });
    });
}
exports.registerUser = registerUser;
function registerHelper(username, email) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if a user with the same email already exists
        const existingEmailUser = yield prisma.users.findFirst({
            where: {
                email: email,
            },
        });
        if (existingEmailUser) {
            throw new email_already_exist_1.EmailAlreadyExist();
        }
        // Check if a user with the same name already exists
        const existingNameUser = yield prisma.users.findFirst({
            where: {
                name: username,
            },
        });
        if (existingNameUser) {
            throw new username_already_exist_1.UsernameAlreadyExist();
        }
    });
}
exports.registerHelper = registerHelper;
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.users.findFirst({
            where: {
                id: id
            }
        });
        if (user) {
            return user;
        }
        return user_not_found_1.UserNotFound;
    });
}
exports.findUserById = findUserById;
function updateUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let pw = user.pw;
        if (user.pw) {
            pw = yield bcrypt_1.default.hash(user.pw, 10);
        }
        return prisma.users.update({
            where: {
                id: user.id,
            },
            data: {
                name: user.name,
                email: user.email,
                password: pw
            },
        });
    });
}
exports.updateUser = updateUser;
