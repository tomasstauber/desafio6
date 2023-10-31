import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { JWT_KEY } from "../config/config.js"
import { createHash, isValidPassword } from "../middlewares/bcrypt.js";
import userModel from "../dao/models/user.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log("Ya existe un usuario registrado con este email!");
                    return done(null, false);
                }
                user = { first_name, last_name, email, age, password: createHash(password), role };
                if (user.email == "adminCoder@coder.com" && password === "adminCod3r123") {
                    user.role = "admin";
                } else {
                    user.role = "user";
                }
                let result = await userModel.create(user);
                if (result) {
                    return done(null, result);
                }
            } catch (error) {
                console.error("Ha ocurrido un error al registrar el usuario!", error);
                return done(error);
            }
        }));

    passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password" },
        async (username, password, done) => {
            try {
                let user = await userModel.findOne({ email: username });
                if (!user) {
                    return done(null, false, { message: "Usuario incorrecto!" });
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: "Contraseña incorrecta!" });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }));

        passport.use("jwt", new JWTStrategy({jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]), secretOrKey: JWT_KEY}, async(jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }));
}

passport.serializeUser((user, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id)
    done(null, user)
});

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

export default initializePassport;