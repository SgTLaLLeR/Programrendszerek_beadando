import {z} from '../node_modules/zod';


export const UserLoginDTOInput = z.object({
    name: z
        .string()
        .min(1, 'A felhasználónév hossza minimum 6 karakter kell legyen!')
        .max(100, 'A felhasználónév hossza maximum 100 karakter lehet!')
        .describe('Username'),
    pw: z
        .string()
        .min(1, 'A jelszó hossza minimum 1 karakter kell legyen!')
        .max(100, 'A jelszó hossza maximum 100 karakter lehet!')
        .describe('Password'),
});

export const UserRegisterDTOInput = z.object({
    email: z.string().min(1).max(100).describe('Email address'),
    name: z
        .string()
        .min(1, 'A felhasználónév hossza minimum 6 karakter kell legyen!')
        .max(100, 'A felhasználónév hossza maximum 100 karakter lehet!')
        .describe('Username'),
    pw: z
        .string()
        .min(1, 'A jelszó hossza minimum 1 karakter kell legyen!')
        .max(100, 'A jelszó hossza maximum 100 karakter lehet!')
        .describe('Password'),
})

export const UserLoginDTOSucces= z.object({
    message: z.string()
})

export type ZUserLoginDTOInput = z.infer<typeof UserLoginDTOInput>;
export type ZUserRegisterDTOInput = z.infer<typeof UserRegisterDTOInput>

