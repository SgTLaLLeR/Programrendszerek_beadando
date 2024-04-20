import {PrismaClient} from "@prisma/client";
import {ZFileDTOInput} from "../dtos/file";


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