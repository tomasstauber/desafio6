import { isValidPassword, createHash } from "../middlewares/bcrypt.js";
import userModel from "../dao/models/user.model.js";

class UserManager {
    async addUser({first_name, last_name, email, age, password, role}) {
        try {
            const userExists = await userModel.findOne({email});
            if (userExists) {
                console.log("Este usuario ya se encuentra registrado!");
                return null;
            }

            const hash = createHash(password);
            const user = await userModel.create({
                first_name, last_name, email, age, password: hash, role
            });
            console.log("Usuario creado correctamente!", user);
            return user;
        } catch (error) {
            console.log("Ha ocurrido un error al crear el usuario!", error);
            return null;
        }
    }

    async login(user, pass) {
        try {
            const userLogged = await userModel.findOne({ email: user }) || null;

            if (userLogged && isValidPassword(userLogged, pass)) {
                const role = userLogged.email === "adminCoder@coder.com" ? "admin" : "user";
                return userLogged;
            }
            return null;
        } catch (error) {
            console.log("Ha ocurrido un error al iniciar sesión!", error)
            return null;
        }
    }

    async restorePassword(user, pass) {
        try {
            const userLogged = await userModel.updateOne({ email: user }, { password: pass }) || null;

            if (userLogged) {
                console.log("Contraseña recuperada correctamente!");
                return ({status:200, message: "Contraseña recuperada correctamente!", redirect:"/login"});
            }

            return false;
        } catch (error) {
            return false;
        }
    }
}

export default UserManager;