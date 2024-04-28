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
exports.updateFile = exports.saveFileToDb = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function saveFileToDb(userId, file, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.file.create({
            data: {
                filename: file.originalname,
                path: file.path,
                userId: userId,
                productId: productId
            }
        });
    });
}
exports.saveFileToDb = saveFileToDb;
function updateFile(user, newFile, imageId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.file.update({
            where: {
                id: imageId
            },
            data: {
                filename: newFile.originalname,
                path: newFile.path,
                userId: user.id,
                productId: productId
            }
        });
    });
}
exports.updateFile = updateFile;
