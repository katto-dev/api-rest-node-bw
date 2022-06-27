import axios from "axios";
import { validationResult, body, param } from "express-validator";

export const validationResultExpress = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

export const bodyRegisterValidator = [
    body("email", "Formato de email incorrecto!")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Password incorrecto: minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    body("password", "Verificacion de passwords: no coinciden").custom(
        (value, { req }) => {
            if (value !== req.body.repassword) {
                throw new Error("No coinciden las contraseñas");
            }
            return value;
        }
    ),
    validationResultExpress
];

export const bodyLoginValidator = [
    body("email", "Formato de email incorrecto!")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Password incorrecto: minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
        validationResultExpress
]

export const bodyLinkValidator = [
    body("longLink", "Formato link incorrecto")
    .trim()
    .notEmpty()
    .custom(async (valueUrl) =>{
        try {
            if(!valueUrl.startsWith('https://')) {
                valueUrl = 'https://' + valueUrl
            }

            await axios.get(valueUrl);
            return valueUrl;
        } catch (error) {
            //console.log(error);
            throw new Error("Not found longLink 404");
        }
    }),
    validationResultExpress
]

export const paramLinkValidator = [
    param("id", "Formato no valido (expressValidator)")
    .trim()
    .notEmpty()
    .escape(),
    validationResultExpress
]