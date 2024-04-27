import express, {NextFunction, Request, Response} from 'express';
import {zParse} from "../services/zod";
import {HTTP_STATUS_OK} from "../constans/http-status-codes";
import * as productService from "../services/product";
import multer from "multer";
import {FileDTOInput} from "../dtos/file";
import {saveFileToDb, updateFile} from "../services/file-upload";
import {
    ProductDTOFormData,
    ProductDTOInput,
    ProductDTOOutput,
    ProductFilterDTOInput, ZProductDTOInput,
    ZProductDTOOutput
} from "../dtos/product";

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

        const file = req.file;
        const body = req.body
        body.price = Number(body.price);
        // body.isAvailable = body.isAvailable === 'true';
        body.uploadedAt = new Date();
        body.userId =req.user?.id;
        body.isAvailable = true;
        const validData=await  zParse(ProductDTOInput, body)

        const result = await productService.createProduct(validData)
        if(req.user && file){
            await saveFileToDb(req.user.id,file,result.id);

        }
        return res.status(HTTP_STATUS_OK).json(req.body);

    } catch (e){
        next (e)
    }
})

protectedProductRouter.post('/getProductByUserId',  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.getProductsByUserId(req.user);
        return res.status(HTTP_STATUS_OK).json(result);
    }catch (e){
        next(e);
    }
})

protectedProductRouter.post('/deleteProduct', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.deleteProductById(req.body.id);
        return res.status(HTTP_STATUS_OK).json('Successfully deleted');
    } catch (e) {
        next(e);
    }
})

protectedProductRouter.post('/updateProduct',upload.single('file'),async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = req.file;
        const body = req.body;
        body.price = Number(body.price);
        body.isAvailable = body.isAvailable === 'true';

        const validData =await  zParse(ProductDTOFormData, body);
        await productService.updateProduct(validData)
        if(data && validData.imageId){
            await updateFile(req.user, data, validData.imageId, validData.id);
        }
        return res.status(HTTP_STATUS_OK).json('OK');

    }catch (e){
        next(e)
    }
})

protectedProductRouter.post('/updateProductState', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validData= await zParse(ProductDTOFormData, req.body);
        await productService.updateAvailableProducts(validData);
        return res.status(HTTP_STATUS_OK).json('Sikeres állapot változtatás');

    }catch(e){
        next(e);
    }
})

protectedProductRouter.post('/buyProduct', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validData = await zParse(ProductDTOOutput, req.body);
        const result =await productService.buyProduct(validData, req.user);
        return res.status(HTTP_STATUS_OK).json(result);
    }catch (e){
        next(e)
    }
})

protectedProductRouter.post('/purchaseHistory', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await productService.purchaseHistory(req.user);
        return res.status(HTTP_STATUS_OK).json(result);
    } catch (e) {
        next(e);
    }
})



export { productRouter, protectedProductRouter};