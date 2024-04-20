import {ZProductDTOInput} from "../dtos/product";
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