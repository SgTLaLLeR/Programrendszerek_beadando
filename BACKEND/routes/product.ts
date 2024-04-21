import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../services/zod";
import {HTTP_STATUS_OK} from "../constans/http-status-codes";
import * as productService from "../services/product";
import multer from "multer";
import {FileDTOInput} from "../dtos/file";
import {saveFileToDb} from "../services/file-upload";
import {ProductFilterDTOInput} from "../dtos/product";

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
productRouter.post('/getAllProductImage', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.getAllProductImage();
        return res.status(HTTP_STATUS_OK).json(result);

    } catch (e) {
        next (e);
    }
})

productRouter.post('/getFilteredProduct', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validData = await zParse(ProductFilterDTOInput, req.body);
        const result = await productService.getFilteredProducts(validData);
        return res.status(HTTP_STATUS_OK).json(result);

    } catch (e){
        next(e);
    }
})

protectedProductRouter.post('/createProduct', upload.single('file'), async (req: Request, res: Response, next)=>{
    try {
        const file =await zParse(FileDTOInput, req.file);
        //TODO majd kitörölni élesben
        const dummy  = {
                name: "Próba Másik",
                description: "Új telefon eladó",
                price: 19000,
                isAvailable: false,
                uploadedAt: new Date(),
                userId: "zxcvbnm"
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