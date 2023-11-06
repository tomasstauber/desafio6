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
                    console.log("El usuario " + email + " ya se encuentra registrado!");
                    return done(null, false);
                }
                user = { first_name, last_name, email, age, password: createHash(password), role };
                console.log("Rol antes de la asignación:", user.role);
                if (user.email == process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                    console.log("Asignando role de admin");
                    user.role = "admin";
                } else {
                    console.log("Asignando role de usuario");
                    user.role = "user";
                }
                let result = await userModel.create(user);
                console.log("Usuario creado con éxito:", result);
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
            console.log("[Auth] Trying to authenticate user:", username);
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

    passport.use("jwt", new JWTStrategy({ jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), secretOrKey: JWT_KEY }, async (jwt_payload, done) => {
        console.log("JWT Payload:", jwt_payload);
        try {
            const user = await userModel.findOne({ email: jwt_payload.email });
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado." });
            }
            return done(null, user);
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