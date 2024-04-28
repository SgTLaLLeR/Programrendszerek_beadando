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
exports.purchaseHistory = exports.buyProduct = exports.updateAvailableProducts = exports.updateProduct = exports.deleteProductById = exports.getFilteredProducts = exports.getAllProductImage = exports.createProduct = exports.getProductsByUserId = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.products.findMany();
    });
}
exports.getProducts = getProducts;
function getProductsByUserId(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.products.findMany({ where: { userId: user.id } });
    });
}
exports.getProductsByUserId = getProductsByUserId;
function createProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.products.create({ data: product });
    });
}
exports.createProduct = createProduct;
function getAllProductImage() {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.file.findMany();
    });
}
exports.getAllProductImage = getAllProductImage;
function getFilteredProducts(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            where: {},
            orderBy: []
        };
        if (filter.name) {
            query.where = query.where || {};
            query.where['name'] = { contains: filter.name };
        }
        if (filter.isAvailable) {
            query.where = query.where || {};
            query.where['isAvailable'] = { equals: true };
        }
        if (filter.priceStart !== undefined || filter.priceEnd !== undefined) {
            query.where = query.where || {};
            query.where['price'] = {};
            if (filter.priceStart !== undefined) {
                query.where['price']['gte'] = filter.priceStart;
            }
            if (filter.priceEnd !== undefined) {
                query.where['price']['lte'] = filter.priceEnd;
            }
        }
        if (filter.dateOrder) {
            query.orderBy = query.orderBy || [];
            query.orderBy.push({ uploadedAt: filter.dateOrder === 'asc' ? 'asc' : 'desc' });
        }
        if (filter.priceOrder) {
            query.orderBy = query.orderBy || [];
            query.orderBy.push({ price: filter.priceOrder === 'asc' ? 'asc' : 'desc' });
        }
        console.log(query);
        return prisma.products.findMany(query);
    });
}
exports.getFilteredProducts = getFilteredProducts;
function deleteProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.products.delete({ where: { id: id } });
    });
}
exports.deleteProductById = deleteProductById;
function updateProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.products.update({
            where: {
                id: product.id
            },
            data: {
                name: product.name,
                price: product.price,
                description: product.description,
            }
        });
    });
}
exports.updateProduct = updateProduct;
function updateAvailableProducts(products) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.products.update({
            where: {
                id: products.id,
            },
            data: {
                isAvailable: products.isAvailable,
            }
        });
    });
}
exports.updateAvailableProducts = updateAvailableProducts;
function buyProduct(product, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (user.id === product.userId) {
            throw new Error('You cannot buy your own product');
        }
        yield prisma.products.update({
            where: {
                id: product.id,
            },
            data: {
                isAvailable: false
            }
        });
        return prisma.purchaseHistory.create({
            data: {
                productId: product.id,
                userId: user.id,
                productName: product.name,
                productPrice: product.price,
                purchaseDate: new Date()
            }
        });
    });
}
exports.buyProduct = buyProduct;
function purchaseHistory(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.purchaseHistory.findMany({
            where: {
                userId: user.id
            }
        });
    });
}
exports.purchaseHistory = purchaseHistory;
