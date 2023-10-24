import userManager from "../dao/UserManager.js";
import userModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/config.js";

class authenticationServices {
    constructor() {
        this.userManager = new userManager();
        this.secretKey = JWT_KEY;
    }

    async login(user, pass) {
        const result = await this.userManager.login(user, pass);
        if (!user) {
            return null;
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, this.secretKey, { expiresIn: "24h" });
        return { user, token };
    }

    async githubCallback(user) {
        try {
            if (!user || !user._json) {
                console.log("La información del usuario está incompleta");
            }
            if(!user._json.email) {
                console.log("Email inválido!");
                user._json.email = "userGithub@user.com";
            }
            let user = await this.userModel.findOne({email:user._json.email});
            if(!user) {
                user = await userModel.create({
                    first_name:profile._json.name || "githubUser",
                    last_name:"",
                    email:profile._json.email,
                    age:100,
                    password:"",
                    role: "user"
                });
                return user;
            }
        } catch (error) {
            console.log("Ha ocurrido un error al autenticar con github!", error);
        }
    }

}

export default authenticationServices;