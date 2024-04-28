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
exports.protectedProductRouter = exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("../services/zod");
const http_status_codes_1 = require("../constans/http-status-codes");
const productService = __importStar(require("../services/product"));
const multer_1 = __importDefault(require("multer"));
const file_upload_1 = require("../services/file-upload");
const product_1 = require("../dtos/product");
const productRouter = express_1.default.Router();
exports.productRouter = productRouter;
const protectedProductRouter = express_1.default.Router();
exports.protectedProductRouter = protectedProductRouter;
const upload = (0, multer_1.default)({ dest: 'uploads/' });
productRouter.post('/getAllProduct', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productService.getProducts();
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
productRouter.post('/getAllProductImage', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productService.getAllProductImage();
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
productRouter.post('/getFilteredProduct', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_1.zParse)(product_1.ProductFilterDTOInput, req.body);
        const result = yield productService.getFilteredProducts(validData);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/createProduct', upload.single('file'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file;
        const body = req.body;
        body.price = Number(body.price);
        // body.isAvailable = body.isAvailable === 'true';
        body.uploadedAt = new Date();
        body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        body.isAvailable = true;
        const validData = yield (0, zod_1.zParse)(product_1.ProductDTOInput, body);
        const result = yield productService.createProduct(validData);
        if (req.user && file) {
            yield (0, file_upload_1.saveFileToDb)(req.user.id, file, result.id);
        }
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(req.body);
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/getProductByUserId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productService.getProductsByUserId(req.user);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/deleteProduct', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield productService.deleteProductById(req.body.id);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json('Successfully deleted');
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/updateProduct', upload.single('file'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.file;
        const body = req.body;
        body.price = Number(body.price);
        body.isAvailable = body.isAvailable === 'true';
        const validData = yield (0, zod_1.zParse)(product_1.ProductDTOFormData, body);
        yield productService.updateProduct(validData);
        if (data && validData.imageId) {
            yield (0, file_upload_1.updateFile)(req.user, data, validData.imageId, validData.id);
        }
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json('OK');
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/updateProductState', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_1.zParse)(product_1.ProductDTOFormData, req.body);
        yield productService.updateAvailableProducts(validData);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json('Sikeres állapot változtatás');
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/buyProduct', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = yield (0, zod_1.zParse)(product_1.ProductDTOOutput, req.body);
        const result = yield productService.buyProduct(validData, req.user);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
protectedProductRouter.post('/purchaseHistory', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield productService.purchaseHistory(req.user);
        return res.status(http_status_codes_1.HTTP_STATUS_OK).json(result);
    }
    catch (e) {
        next(e);
    }
}));
