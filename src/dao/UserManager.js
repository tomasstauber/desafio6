import { userModel } from "./models/user.model.js";

class UserManager {
    async addUser(user) {
        try {
            if (user.email == "adminCoder@coder.com") {
                user.role = "admin";
            }

            await userModel.create(user);
            console.log("Usuario creado correctamente!");

            return true;
        } catch (error) {
            return false;
        }
    }

    async login(user) {
        try {
            const userLogged = await userModel.findOne({ email: user }) || null;

            if (userLogged) {
                console.log("Usuario logueado correctamente!");
                return userLogged;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    async restorePassword(user, pass) {
        try {
            const userLogged = await userModel.updateOne({ email: user }, { password: pass }) || null;

            if (userLogged) {
                console.log("Contraseña recuperada correctamente!");
                return userLogged;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
}

export default UserManager;