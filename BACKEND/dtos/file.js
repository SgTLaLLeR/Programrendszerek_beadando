"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDTOOutput = exports.FileDTOInput = void 0;
const zod_1 = require("zod");
exports.FileDTOInput = zod_1.z.object({
    originalname: zod_1.z.string(),
    path: zod_1.z.string(),
});
exports.FileDTOOutput = zod_1.z.object({
    id: zod_1.z.string(),
    originalname: zod_1.z.string(),
    path: zod_1.z.string(),
    productId: zod_1.z.string(),
});
