import express, {Request, Response} from 'express';
import {userRouter} from './routes/user';
import {handleErrors} from "./middlewares/error-handler";
import {Logger} from "./middlewares/log-to-console";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import {ZUserLoginDTOInput} from "./dtos/user-login";
import {findUserById, loginUser} from "./services/user";
import { Strategy as LocalStrategy } from 'passport-local';


const port=8000;
const app = express();
const HTTP_PORT=port;

passport.use( new LocalStrategy(
    {
        usernameField: 'name',
        passwordField: 'pw'
    },
    async (username, password, done) => {
        try {
            const userInput: ZUserLoginDTOInput = {name: username, pw: password};
            const user = await loginUser(userInput);
            done(null, user);
        } catch (err) {
            done(err);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser((id: any, done) => {
    findUserById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err);
        })
});

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



app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

app.use('/user', userRouter);

app.get('/', (_req: Request, res: Response) => {
    return res.status(200).json('Check postman for guidance');
});


app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.use(handleErrors);
