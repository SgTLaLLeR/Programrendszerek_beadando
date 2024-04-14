
import {PrismaClient} from '@prisma/client'
import {zParse} from "./zod";

import {
    ZUserLoginDTOInput, UserLoginDTOSucces, ZUserRegisterDTOInput,
} from "../dtos/user-login";
import {UserNotFound} from "../errors/user-not-found";






const prisma = new PrismaClient();


export async function loginUser(userInput: ZUserLoginDTOInput) {

    const user=await prisma.users.findFirst({
        where:{
            name: userInput.name,
            password: userInput.pw
        }
    })

    if (!user) {
        throw new UserNotFound(userInput.name);
    }

    return zParse(UserLoginDTOSucces, {
        message: 'Login Success',

    });
}

export async function registerUser(userInput: ZUserRegisterDTOInput){
    const user = await prisma.users.create({
        data: {
            email: userInput.email,
            name: userInput.name,
            password: userInput.pw,
        }
    })
    return zParse(UserLoginDTOSucces,{
        message: 'Register Success',
    })
}