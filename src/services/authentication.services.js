import userManager from "../dao/UserManager.js";
import userModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../config/config.js";

class authenticationServices {
    constructor() {
        this.userManager = new userManager();
        this.userModel = new userModel();
        this.secretKey = JWT_KEY;
    }

    async login(user, pass) {
        const result = await this.userManager.login(user, pass);
        if (!result) {
            return null;
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, this.secretKey, { expiresIn: "24h" });
        return { user, token };
    }

    async githubCallback(profile) {
        try {
            if (!profile || !profile._json) {
                throw new Error("Información incompleta!");
            }

            if (!profile._json.email) {
                console.warn("Email es nulo. Manejando este caso de manera específica.");
                profile._json.email = "userGithub@user.com";
            }

            let user = await userModel.findOne({ email: profile._json.email });

            if (!user) {
                user = await userModel.create({
                    first_name: profile._json.name || 'Unknown',
                    last_name: '',
                    email: profile._json.email,
                    age: 100,
                    password: '',
                    role: 'user',
                });
            }

            return user;
        } catch (error) {
            console.error("Ha ocurrido un error:", error);
            throw error;
        }
    }
}

export default authenticationServices;