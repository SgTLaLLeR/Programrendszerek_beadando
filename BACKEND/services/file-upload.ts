import {PrismaClient} from "@prisma/client";
import {ZFileDTOInput, ZFileDTOOutput} from "../dtos/file";


const prisma = new PrismaClient();

export async function saveFileToDb(userId: string, file: ZFileDTOInput, productId: string) {
    return prisma.file.create({
        data: {
            filename: file.originalname,
            path: file.path,
            userId: userId,
            productId: productId
        }
    });
}

export async function updateFile(user: any,newFile: ZFileDTOInput, imageId: string, productId : string){
    return prisma.file.update({
        where : {
            id : imageId
        },
        data : {
            filename: newFile.originalname,
            path: newFile.path,
            userId: user.id,
            productId: productId
        }
    })
}