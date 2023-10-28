import express from "express";
import { passportCall, authorization } from "../middlewares/passportAuthorization.js";
import passport from "passport";
import userManager from "../dao/UserManager.js";
import userController from "../controllers/users.controller.js";
import authenticationController from "../controllers/authentication.controllers.js";

const router = express.Router();
const UM = new userManager();
const usersController = new userController();
const authController = new authenticationController();

router.post("/login", (req, res) => authController.login(req, res));

router.get("/logout", (req, res) => authController.logout(req, res));

router.post("/register", usersController.register.bind(usersController));

router.get("/restore", usersController.restorePassword.bind(usersController));

router.get("/current", passportCall("jwt"), authorization("user"), (req, res) => { usersController.current(req, res) });

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
});

export default router;