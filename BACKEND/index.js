"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user");
const error_handler_1 = require("./middlewares/error-handler");
const log_to_console_1 = require("./middlewares/log-to-console");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = require("./middlewares/auth");
const passport_config_1 = __importDefault(require("../BACKEND/passport/passport-config"));
const product_1 = require("./routes/product");
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("./constans/http-status-codes");
const port = 8000;
const app = (0, express_1.default)();
const HTTP_PORT = port;
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json(), log_to_console_1.Logger);
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_config_1.default.initialize());
app.use(passport_config_1.default.session());
const server = app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
//public endpoints
app.use('/user', user_1.userRouter);
app.use('/product', product_1.productRouter);
//protected endpoints
app.use('/protected/user', auth_1.ensureAuthenticated, user_1.protectedUserRouter);
app.use('/protected/product', auth_1.ensureAuthenticated, product_1.protectedProductRouter);
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (_req, res) => {
    return res.status(200).json('Check postman for guidance');
});
app.post('/checkAuth', auth_1.ensureAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(http_status_codes_1.HTTP_STATUS_OK).send(true);
    }
    else {
        return res.status(http_status_codes_1.HTTP_STATUS_UNAUTHORIZED).send(false);
    }
});
process.on('SIGINT', () => {
    console.log("Received SIGINT. Shutting down gracefully...");
    server.close(err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});
app.use(error_handler_1.handleErrors);
