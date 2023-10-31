import { createHash } from "../middlewares/bcrypt.js";
import userServices from "../services/user.services.js";

class userController {
    constructor() {
        this.userServices = new userServices();
    }

    async register(req, res) {
        const { first_name, last_name, email, age, password, role } = req.body;
        const response = await this.userServices.register({
            first_name, last_name, email, age, password, role
        });
        return res.status(response.status === "Ok" ? 200 : 400).json(response);
    }

    async restorePassword(req, res) {
        const { user, pass } = req.query;
        try {
            const newPassword = await this.userServices.restorePassword(user, createHash(pass));
            if (newPassword) {
                return res.send({ status: "Ok", message: "Contraseña recuperada correctamente!" });
            } else {
                return res.status(401).send({ status: "Error", message: "Ha ocurrido un error al actualizar la contraseña!" });
            }
        } catch {
            console.log("Ha ocurrido un error al restaurar la contraseña!");
            return res.status(500).send({ status: "Error", message: "Internal Server Error" })
        }
    }

    async current(req, res) {
        if (req.user) {
            return res.send({ status: "Ok", payload: req.user });
        } else {
            return res.status(401).send({ status: "Error", message: "No estás autorizado para acceder aquí!" })
        }
    }
}

export default userController;