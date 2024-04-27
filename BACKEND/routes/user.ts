import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../services/zod";
import * as userService from "../services/user";
import {UserProfileDTO, UserRegisterDTOInput} from "../dtos/user-login";
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

protectedUserRouter.post('/profile',async (req: Request, res: Response)=>{
    console.log(req.user)
    return res.status(HTTP_STATUS_OK).json(req.user);


});

userRouter.post('/findById', async (req: Request, res: Response, next : NextFunction)=>{
    try {
        const user = await userService.findUserById(req.body.id);
        return res.status(HTTP_STATUS_OK).json(user);
    } catch (e){
        next (e);
    }

})
protectedUserRouter.post('/logout', (req : Request, res : Response, next : NextFunction) => {
    req.logout(err => {
        next(err)
    });
    res.status(200).json({ message: "Logout successful" });
});

protectedUserRouter.post('/update', async (req: Request, res: Response, next : NextFunction) =>{
    try {
        const validData = await zParse(UserProfileDTO, req.body);
        const result = await userService.updateUser(validData);
        return res.status(HTTP_STATUS_OK).json(result);

    }catch (e){
        next(e)
    }
});


export { userRouter, protectedUserRouter };