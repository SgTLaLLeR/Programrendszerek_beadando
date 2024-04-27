import {
    ProductDTOFormData,
    ProductDTOOutput, ZProductDTOFormData,
    ZProductDTOInput,
    ZProductDTOOutput,
    ZProductFilterDTOInput
} from "../dtos/product";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

export async function getProducts() {
    return prisma.products.findMany();

}

export async function getProductsByUserId(user : any){
    return prisma.products.findMany({where:{userId:user.id}});
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
}

export async function deleteProductById(id : string){
    return prisma.products.delete({where:{id:id}});

}

export async function updateProduct(product: ZProductDTOFormData) {
    return prisma.products.update({
        where: {
            id: product.id
        },
        data:{
            name: product.name,
            price: product.price,
            description : product.description,
        }
    });
}

export async function updateAvailableProducts(products : ZProductDTOFormData){
    return prisma.products.update({
        where : {
            id : products.id,
        },
        data : {
            isAvailable : products.isAvailable,
        }
    })
}

export async function buyProduct(product: ZProductDTOOutput, user: any){
    if(user.id === product.userId){
        throw new Error('You cannot buy your own product');
    }

    await prisma.products.update({
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
}

export async function purchaseHistory(user : any ){
    return prisma.purchaseHistory.findMany({
        where : {
            userId: user.id
        }
    })
}