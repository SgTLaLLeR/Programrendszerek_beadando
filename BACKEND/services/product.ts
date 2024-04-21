import {ZProductDTOInput, ZProductFilterDTOInput} from "../dtos/product";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

export async function getProducts() {
    return prisma.products.findMany();

}

export async function getProductsByUserId(id : string){
    return prisma.products.findFirst({where:{id:id}});
}

export async function createProduct(product : ZProductDTOInput){
    return prisma.products.create({data: product});
}

export async function getAllProductImage(){
    return prisma.file.findMany();
}

export async function getFilteredProducts(filter: ZProductFilterDTOInput) {
    type Query = {
        where?: { [key: string]: any },
        orderBy?: Array<{ [key: string]: 'asc' | 'desc' }>
    };

    let query: Query = {
        where: {},
        orderBy: []
    };

    if (filter.name) {
        query.where = query.where || {};
        query.where['name'] = { contains: filter.name };
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

    return prisma.products.findMany(query);
}