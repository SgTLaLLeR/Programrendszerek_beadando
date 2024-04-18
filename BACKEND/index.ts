import express, {Request, Response} from 'express';
import {protectedUserRouter, userRouter} from './routes/user';
import {handleErrors} from "./middlewares/error-handler";
import {Logger} from "./middlewares/log-to-console";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {ensureAuthenticated} from "./middlewares/auth";
import passport from '../BACKEND/passport/passport-config';

const port=8000;
const app = express();
const HTTP_PORT=port;

app.use(express.json(), Logger);
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const server=app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
//public endpoints
app.use('/user', userRouter);

//protected endpoints
app.use('/protected/user',ensureAuthenticated,protectedUserRouter);


app.get('/', (_req: Request, res: Response) => {
    return res.status(200).json('Check postman for guidance');
});



process.on('SIGINT', () => {
    console.log("Received SIGINT. Shutting down gracefully...");
    server.close(err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});

app.use(handleErrors);