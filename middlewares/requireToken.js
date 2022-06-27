import jwt from "jsonwebtoken"
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireToken = (req, res, next) => {
    try {
        //console.log(req.headers);
        let token = req.headers?.authorization;
        //console.log(token)
        if(!token) throw new Error("No existe el token en el header usa Bearer");

        token = token.split(" ")[1];
        //console.log({ token: token })

        //const payload = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(payload)
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();
    } catch (error) {
        //console.log(error.message);

        //return res.status(401).json({ error: error.message })
        return res
                .status(401)
                .send({ error: tokenVerificationErrors[error.message] });
    }
}