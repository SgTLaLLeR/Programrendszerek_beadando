import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../services/zod";
import {HTTP_STATUS_OK} from "../constans/http-status-codes";
import * as productService from "../services/product";
import multer from "multer";
import {FileDTOInput} from "../dtos/file";
import {saveFileToDb} from "../services/file-upload";

declare global {
    namespace Express {
        interface User {
            id: string
        }
    }
}


const productRouter = express.Router();
const protectedProductRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

productRouter.post('/getAllProduct', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.getProducts();
        return res.status(HTTP_STATUS_OK).json(result);

    }catch (e){
        next(e)
    }

})

protectedProductRouter.post('/createProduct', upload.single('file'), async (req: Request, res: Response, next)=>{
    try {
        const file =await zParse(FileDTOInput, req.file);
        //TODO majd kitörölni élesben
        const dummy  = {

            name : "Kocsi",
            description: "Komoly auto elado",
            price : 1004500,
            isAvailable: true,
            userId: "asdqweasd"
        }

        //const validData = await zParse(ProductDTOInput, req.body);
        const result = await productService.createProduct(dummy)
        if(req.user){
            await saveFileToDb(req.user.id,file,result.id);

        }
        return res.status(HTTP_STATUS_OK).json(result);

    } catch (e){
        next (e)
    }
})

protectedProductRouter.post('/getProductByUserId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.getProductsByUserId(req.body.userId);
        return res.status(HTTP_STATUS_OK).json(result);
    }catch (e){
        next(e);
    }
})


export { productRouter, protectedProductRouter};