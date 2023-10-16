import passport from "passport";
import jwt from "passport-jwt";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const JWTStrategy = jwt.Strategy;
const LocalStrategy = local.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("login", new LocalStrategy({passReqToCallback:true, usernameField:"email", session:false}, async (req, username, password, done) => {
        const {email, pass} = req.body;
        try {
            let user = await userModel.findOne({email:username});

            if (!user) {
                console.log("Usuario u contraseña incorrectos!");
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                console.log("Usuario u contraseña incorrectos!");
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("register", new LocalStrategy({passReqToCallback:true, usernameField:"email"}, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        try {
            let user = await userModel.findOne({email:username});

            if (user) {
                console.log("El usuario " + email + " ya se encuentra registrado!");
                return done(null, false);
            }

            user = {first_name, last_name, email, age, password:createHash(password)};

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

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:"S3CR3T0"
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
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

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }

    return token;
}

export default initializePassport;