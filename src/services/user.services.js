import UserManager from "../dao/UserManager.js";

class userServices {
    constructor() {
        this.UserManager = new UserManager();
    }

    async register({ first_name, last_name, email, age, password, role}) {
        try {
            const user = await this.UserManager.addUser({
                first_name, last_name, email, age, password, role
            });
            if (user) {
                return {status: "Ok", user, redirect: "/login"};
            } else {
                return {status: "Error", message: "Ya existe un usuario registrado con este email"}
            }
        } catch (error) {
            console.log("Ha ocurrido un error al registrar el usuario");
            return {status: "Error", message: "Internal Server Error"}
        }
    }

    async restorePassword (user, pass) {
        const password = await this.UserManager.restorePassword(user, pass);
        if(password) {
            return {status: "Ok", password, redirect: "/login"};
        }
    }
}

export default userServices;