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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = require("../services/user");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'name',
    passwordField: 'pw'
}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInput = { name: username, pw: password };
        const user = yield (0, user_1.loginUser)(userInput);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    (0, user_1.findUserById)(id)
        .then(user => {
        done(null, user);
    })
        .catch(err => {
        done(err);
    });
});
exports.default = passport_1.default;
