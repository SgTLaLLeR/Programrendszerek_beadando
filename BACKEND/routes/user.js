"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.protectedUserRouter = exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("../services/zod");
const userService = __importStar(require("../services/user"));
const user_login_1 = require("../dtos/user-login");
const http_status_codes_1 = require("../constans/http-status-codes");
const passport_config_1 = __importDefault(require("../passport/passport-config"));
// Public endpoints
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
// Protected endpoints
const protectedUserRouter = express_1.default.Router();
exports.protectedUserRouter = protectedUserRouter;
userRouter.post('/login', passport_config_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
userRouter.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_1.zParse)(user_login_1.UserRegisterDTOInput, req.body);
        const body = yield userService.registerUser(validData);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(body);
    }
    catch (e) {
        next(e);
    }
}));
protectedUserRouter.get('/logout', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(http_status_codes_1.HTTP_STATUS_OK).json('OK');
}));
protectedUserRouter.post('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    return res.status(http_status_codes_1.HTTP_STATUS_OK).json(req.user);
}));
userRouter.post('/findById', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.findUserById(req.body.id);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(user);
    }
    catch (e) {
        next(e);
    }
}));
protectedUserRouter.post('/logout', (req, res, next) => {
    req.logout(err => {
        next(err);
    });
    res.status(200).json({ message: "Logout successful" });
});
protectedUserRouter.post('/update', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_1.zParse)(user_login_1.UserProfileDTO, req.body);
        const result = yield userService.updateUser(validData);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
