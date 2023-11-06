import authenticationServices from "../services/authentication.services.js";

class authenticationController {
    constructor() {
        this.authenticationServices = new authenticationServices();
    }

    async login(req, res) {
        const { email, password } = req.body;
        const userLogged = await this.authenticationServices.login(email, password);
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
        res.cookie('CookieToken', userLogged.token, { httpOnly: true, secure: false });
        return res.redirect("/products");
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
            if (!req.session) {
                res.clearCookie("coderCookieToken");
                return res.redirect("/login");
            }
        });
    };
}

export default authenticationController;