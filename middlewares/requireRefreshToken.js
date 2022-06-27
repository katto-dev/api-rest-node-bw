import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireRefreshToken = (req, res, next) => {
    try {
        // Verificamos si en las cookie existe el refreshToken
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!refreshTokenCookie) throw new Error("No existe el token");

        // Verificamos el refreshToken
        const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        // Agregamos el uid al req
        req.uid = uid;
        // Vamos al siguiente middleware
        next();
    } catch (error) {
        //console.log(error);
        res.status(401).json({ error: tokenVerificationErrors[error.message]});
    }
};