import express, {Request, Response} from 'express';
import {userRouter, protectedUserRouter} from './routes/user';
import {handleErrors} from "./middlewares/error-handler";
import {Logger} from "./middlewares/log-to-console";
const port=8080;
const app = express();
const HTTP_PORT=port;

app.use(express.json(), Logger);
app.use(express.urlencoded({ extended: false }));

app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.use('/user', userRouter);

app.get('/', (_req: Request, res: Response) => {
    return res.status(200).json('Check postman for guidance');
});
app.use(handleErrors);
