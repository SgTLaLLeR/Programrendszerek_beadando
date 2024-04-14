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
exports.handleErrors = void 0;
const zod_1 = require("zod");
const http_status_codes_1 = require("../constans/http-status-codes");
const zod_2 = require("../services/zod");
function handleErrors(err, _req, res, _next) {
    return __awaiter(this, void 0, void 0, function* () {
        const statusMessageMapping = {
            PrismaClientInitializationError: { status: http_status_codes_1.HTTP_STATUS_INTERNAL_SERVER_ERROR, message: 'Cannot connect to the database' },
            ZodError: { status: http_status_codes_1.HTTP_STATUS_BAD_REQUEST, message: '' },
            UserNotFound: { status: http_status_codes_1.HTTP_STATUS_UNAUTHORIZED, message: '' },
            IncorrectPassword: { status: http_status_codes_1.HTTP_STATUS_UNAUTHORIZED, message: '' },
            EmailAlreadyExist: { status: http_status_codes_1.HTTP_STATUS_BAD_REQUEST, message: '' },
            UsernameAlreadyExist: { status: http_status_codes_1.HTTP_STATUS_BAD_REQUEST, message: '' },
            RefreshError: { status: http_status_codes_1.HTTP_STATUS_FORBIDDEN, message: '' }
        };
        const statusMessage = statusMessageMapping[err.constructor.name];
        if (!statusMessage) {
            return res.status(http_status_codes_1.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Unexpected error : ' + err });
        }
        if (err instanceof zod_1.ZodError) {
            const message = yield (0, zod_2.parseZodError_backend)(err);
            //return res.status(statusMessage.status).json({error: ZodDTO.fromZodError(err)});
            return res.status(statusMessage.status).json({ message });
        }
        return res.status(statusMessage.status).json({ message: statusMessage.message || err.message });
    });
}
exports.handleErrors = handleErrors;
