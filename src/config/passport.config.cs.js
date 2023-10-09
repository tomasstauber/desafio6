import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await userModel.findOne({ email: username });

            if (user) {
                console.log("Ya existe un usuario registrado con este email!");
                return done(null, false);
            }

            user = { first_name, last_name, email, age, password: createHash(password) };

            if (user.email == "adminCoder@coder.com") {
                user.role = "admin";
            }

            let result = await userModel.create(user);

            if (result) {
                return done(null, result);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({ passReqToCallback: true, usernameField: "email", session: false }, async (req, username, password, done) => {
        const { email, pass } = req.body;
        try {
            let user = await userModel.findOne({ email: username });
            console.log(user);

            if (!user) {
                console.log("Error! El usuario no existe!");
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                console.log("Error! La contraseña es inválida!");
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.c3617ded38f824fd",
        clientSecret: "2fe07bd5a194086af378a3c1f7fca79e6beb183c",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email });

            if (user) {
                return done(null, user);
            } else {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: 50,
                    password: ""
                }

                let result = await userModel.create(newUser);

                return done(null, result);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;