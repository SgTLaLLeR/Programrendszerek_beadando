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
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user");
const error_handler_1 = require("./middlewares/error-handler");
const log_to_console_1 = require("./middlewares/log-to-console");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const user_2 = require("./services/user");
const passport_local_1 = require("passport-local");
const port = 8000;
const app = (0, express_1.default)();
const HTTP_PORT = port;
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'name',
    passwordField: 'pw'
}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInput = { name: username, pw: password };
        const user = yield (0, user_2.loginUser)(userInput);
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
    (0, user_2.findUserById)(id)
        .then(user => {
        done(null, user);
    })
        .catch(err => {
        done(err);
    });
});
app.use(express_1.default.json(), log_to_console_1.Logger);
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
app.use('/user', user_1.userRouter);
app.get('/', (_req, res) => {
    return res.status(200).json('Check postman for guidance');
});
app.post('/login', passport_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
app.use(error_handler_1.handleErrors);
