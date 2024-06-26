
import {ZodError} from "zod";
import {NextFunction, Request, Response} from 'express';
import {
    HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_FORBIDDEN,
    HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_UNAUTHORIZED
} from "../constans/http-status-codes";
import {parseZodError_backend} from "../services/zod";


export async function handleErrors(err: Error, _req: Request, res: Response, _next: NextFunction) {
    const statusMessageMapping: Record<string, {status: number, message: string}> = {
        PrismaClientInitializationError: {status: HTTP_STATUS_INTERNAL_SERVER_ERROR, message: 'Cannot connect to the database'},
        ZodError: {status: HTTP_STATUS_BAD_REQUEST, message: ''},
        UserNotFound: {status: HTTP_STATUS_UNAUTHORIZED, message: ''},
        IncorrectPassword: {status: HTTP_STATUS_UNAUTHORIZED, message: ''},
        EmailAlreadyExist: {status: HTTP_STATUS_BAD_REQUEST, message: ''},
        UsernameAlreadyExist: {status: HTTP_STATUS_BAD_REQUEST, message: ''},
        RefreshError: {status: HTTP_STATUS_FORBIDDEN, message: ''}
    };


    const statusMessage = statusMessageMapping[err.constructor.name];
    if (!statusMessage) { return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({message: 'Unexpected error : ' +err}); }

    if (err instanceof ZodError){
        const message=await parseZodError_backend(err)
        //return res.status(statusMessage.status).json({error: ZodDTO.fromZodError(err)});
        return res.status(statusMessage.status).json({message});
    }

    return res.status(statusMessage.status).json({message: statusMessage.message || err.message});
}