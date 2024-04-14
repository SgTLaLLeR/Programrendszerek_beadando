"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginDTOSucces = exports.UserRegisterDTOInput = exports.UserLoginDTOInput = void 0;
const zod_1 = require("../node_modules/zod");
exports.UserLoginDTOInput = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'A felhasználónév hossza minimum 6 karakter kell legyen!')
        .max(100, 'A felhasználónév hossza maximum 100 karakter lehet!')
        .describe('Username'),
    pw: zod_1.z
        .string()
        .min(1, 'A jelszó hossza minimum 1 karakter kell legyen!')
        .max(100, 'A jelszó hossza maximum 100 karakter lehet!')
        .describe('Password'),
});
exports.UserRegisterDTOInput = zod_1.z.object({
    email: zod_1.z.string().min(1).max(100).describe('Email address'),
    name: zod_1.z
        .string()
        .min(1, 'A felhasználónév hossza minimum 6 karakter kell legyen!')
        .max(100, 'A felhasználónév hossza maximum 100 karakter lehet!')
        .describe('Username'),
    pw: zod_1.z
        .string()
        .min(1, 'A jelszó hossza minimum 1 karakter kell legyen!')
        .max(100, 'A jelszó hossza maximum 100 karakter lehet!')
        .describe('Password'),
});
exports.UserLoginDTOSucces = zod_1.z.object({
    message: zod_1.z.string()
});
