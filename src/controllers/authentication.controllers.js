import authenticationServices from "../services/authentication.services.js";

class authenticationController {
    constructor() {
        this.authenticationServices = new authenticationServices();
    }

    async login(req, res) {
        const { user, pass } = req.body;
        const userLogged = await this.authenticationServices.login(user, pass);
        if (!userLogged) {
            return res.status(401).json({ status: "Error", message: "Credenciales inválidas" });
        }
        req.session.user = {
            id: userLogged.user._id,
            email: userLogged.user.email,
            first_name: userLogged.user.first_name,
            last_name: userLogged.user.last_name,
            role: userLogged.user.role
        }
        return res.status(200).json({ status: "Ok", user: userLogged.user, redirect: "/products" });
    };

    async githubCallback(req, res) {
        console.log("Autenticando con GitHub");
        try {
            if (req.user) {
                req.session.user = req.user;
                req.session.logged = true;
                return res.redirect("/products");
            } else {
                return res.redirect("/faillogin");
            }
        } catch (error) {
            console.error("Ha ocurrido un error al iniciar sesión", error);
            return res.redirect("/login")
        }
    };

    async logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                return res.redirect("/faillogin");
            }
            return res.redirect("/login")
        })
    };

}

export default authenticationController;