import { isValidPassword, createHash } from "../middlewares/bcrypt.js";
import userModel from "../dao/models/user.model.js";

class UserManager {
    async addUser({ first_name, last_name, email, age, password, role }) {
        try {
            const userExists = await userModel.findOne({ email });
            if (userExists) {
                console.log("Este usuario ya se encuentra registrado!");
                return null;
            }

            const hash = createHash(password);
            const cart = await cartModel.create({ products: [] });
            const user = await userModel.create({
                first_name, last_name, email, age, password: hash, cart: cart._id, role
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
            const usuarioLogueado = await userModel.findOne({ email: user });
            if (usuarioLogueado && isValidPassword(usuarioLogueado, pass)) {
                const role = usuarioLogueado.email === "adminCoder@coder.com" ? "admin" : "user";
                return usuarioLogueado;
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
                console.log("Contraseña restablecida.");
                return userLogged;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}

export default UserManager;