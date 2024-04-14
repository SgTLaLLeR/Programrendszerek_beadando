"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user");
const error_handler_1 = require("./middlewares/error-handler");
const log_to_console_1 = require("./middlewares/log-to-console");
const port = 8080;
const app = (0, express_1.default)();
const HTTP_PORT = port;
app.use(express_1.default.json(), log_to_console_1.Logger);
app.use(express_1.default.urlencoded({ extended: false }));
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
app.use('/user', user_1.userRouter);
app.get('/', (_req, res) => {
    return res.status(200).json('Check postman for guidance');
});
app.use(error_handler_1.handleErrors);
