import bcrypt from 'bcrypt';
import {PrismaClient} from '@prisma/client'
import {zParse} from "./zod";

import {
    ZUserLoginDTOInput, UserLoginDTOSucces, ZUserRegisterDTOInput,
} from "../dtos/user-login";
import {UserNotFound} from "../errors/user-not-found";
import {IncorrectPassword} from "../errors/incorrect-password";
import {EmailAlreadyExist} from "../errors/email-already-exist";
import {UsernameAlreadyExist} from "../errors/username-already-exist";

const prisma = new PrismaClient();



export async function loginUser(userInput: ZUserLoginDTOInput) {
    const user = await prisma.users.findFirst({
        where: {
            name: userInput.name,
        },
    });

    if (!user) {
        throw new UserNotFound(userInput.name);
    }

    const passwordMatch = await bcrypt.compare(userInput.pw, user.password);

    if (!passwordMatch) {
        throw new IncorrectPassword();
    }

    // return zParse(UserLoginDTOSucces, {
    //     message: 'Login Success',
    // });
    return user;
}

export async function registerUser(userInput: ZUserRegisterDTOInput) {
    await registerHelper(userInput.name, userInput.email);

    const hashedPassword = await bcrypt.hash(userInput.pw, 10); // 10 a salt rounds

    const user = await prisma.users.create({
        data: {
            email: userInput.email,
            name: userInput.name,
            password: hashedPassword,
        }
    });

    return zParse(UserLoginDTOSucces, {
        message: 'Register Success',
    });
}

export async function registerHelper(username: string, email: string) {
    // Check if a user with the same email already exists
    const existingEmailUser = await prisma.users.findFirst({
        where: {
            email: email,
        },
    });

    if (existingEmailUser) {
        throw new EmailAlreadyExist();
    }

    // Check if a user with the same name already exists
    const existingNameUser = await prisma.users.findFirst({
        where: {
            name: username,
        },
    });

    if (existingNameUser) {
        throw new UsernameAlreadyExist();
    }
}


export async function  findUserById(id : string){
    const user = await prisma.users.findFirst({
        where: {
            id:id
        }
    })
    if(user){
        return zParse(UserLoginDTOSucces,{
            message: user.id
        })
    }
    return UserNotFound;
}