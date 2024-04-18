import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../services/zod";
import * as userService from "../services/user";
import {UserLoginDTOInput, UserRegisterDTOInput} from "../dtos/user-login";
import {HTTP_STATUS_OK} from "../constans/http-status-codes";
import passport from "../passport/passport-config";




// Public endpoints
const userRouter = express.Router();
// Protected endpoints
const protectedUserRouter = express.Router();


userRouter.post('/login' ,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

userRouter.post('/register', async (req: Request, res: Response, next : NextFunction) => {
    try {
        const validData = await zParse(UserRegisterDTOInput,req.body);

        const body = await userService.registerUser(validData);

        return res.status(HTTP_STATUS_OK).json(body);

    } catch (e){
        next (e);
    }
})

protectedUserRouter.get('/logout', async (req: Request, res : Response, next : NextFunction) =>{
    return res.status(HTTP_STATUS_OK).json('OK');
});

protectedUserRouter.post('/profile',async (_req: Request, res: Response)=>{
    return res.status(HTTP_STATUS_OK).json('OK');


});

export { userRouter, protectedUserRouter };