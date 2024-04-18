import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ZUserLoginDTOInput } from "../dtos/user-login";
import { findUserById, loginUser } from "../services/user";

passport.use(new LocalStrategy(
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

export default passport;