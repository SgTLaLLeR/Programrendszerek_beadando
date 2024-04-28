"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDTOFormData = exports.ProductFilterDTOInput = exports.ProductDTOOutput = exports.ProductDTOInput = void 0;
const zod_1 = require("zod");
exports.ProductDTOInput = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    isAvailable: zod_1.z.boolean(),
    uploadedAt: zod_1.z.date(),
    userId: zod_1.z.string()
});
exports.ProductDTOOutput = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    isAvailable: zod_1.z.boolean(),
    userId: zod_1.z.string(),
    imageId: zod_1.z.string().optional()
});
exports.ProductFilterDTOInput = zod_1.z.object({
    name: zod_1.z.string().optional(),
    priceStart: zod_1.z.number().optional(),
    priceEnd: zod_1.z.number().optional(),
    dateOrder: zod_1.z.string().optional(),
    priceOrder: zod_1.z.string().optional(),
    isAvailable: zod_1.z.boolean().optional()
});
exports.ProductDTOFormData = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    isAvailable: zod_1.z.boolean(),
    imageId: zod_1.z.string().optional()
});
