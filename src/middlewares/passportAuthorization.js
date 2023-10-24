import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return error;
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ status: "Error", message: "No estás autorizado a navegar por aquí!" });
        }
        if (req.user.role != role) {
            return res.status(403).send({ status: "Error", message: "No tienes los permisos necesarios!" });
        }
        next();
    };
};
