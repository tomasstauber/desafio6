import express from "express";
import { createHash, isValidPassword, passportCall, authorization } from "../utils.js";
import passport from "passport";
import userManager from "../dao/UserManager.js";
import { userModel } from "../dao/models/user.model.js";
import jwt from "jsonwebtoken"

const router = express.Router();
const UM = new userManager();
const PRIVATE_KEY = "S3CR3T0";

router.post("/login", async (req, res) => {
    const {email, pass} = req.body;

    let user = await userModel.findOne({email:email});

    if (!user) {
        return res.status(401).send({status:"error", message:"Error! El usuario no existe!"});
    }
    
    let token = jwt.sign({email:email, password:pass, role:user.role}, PRIVATE_KEY, {expiresIn:"24h"});
    res.cookie("coderCookieToken", token, {maxAge:3600*1000, httpOnly:true});

    return res.redirect("/products");
});

router.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
    res.redirect("/login");
});

router.get("/logout", async (req, res) => {
    req.session.destroy;
    res.redirect("/");
});

router.get("/current", passportCall("jwt"), authorization("admin"), (req, res) => {
    res.send({status:"OK", payload:req.user});
});
  
router.get("/restore", async (req, res) => {
    let {user, pass} = req.query;
    pass = createHash(pass);
    const passwordRestored = await UM.restorePassword(user, pass);

    if (passwordRestored) {
        res.send({status:"ok", message:"La contraseña se ha actualizado correctamente!"});
    } else {
        res.status(401).send({status:"error", message:"No se pudo actualizar la contraseña!"});
    }    
});

router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
});

export default router;