import passport from "passport";
import GitHubStrategy from "passport-github2";
import authenticationServices from "../services/authentication.services.js";
import userModel from "../dao/models/user.model.js";
import { CLIENT_ID_GITHUB, CLIENT_SECRET_GITHUB } from "../config/config.js";

const initializeGitHubPassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: CLIENT_ID_GITHUB,
        clientSecret: CLIENT_SECRET_GITHUB,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, githubUser, done) => {
        try {
            const authService = new authenticationServices();
            console.log("Perfil: ", JSON.stringify(githubUser, null, 2));
            const user = await authService.githubCallback(githubUser);

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

}

export default initializeGitHubPassport;