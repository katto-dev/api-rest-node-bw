import { Router } from "express";
import {
    infoUser,
    login,
    register,
    refreshToken,
    logout,
} from "../controllers/auth.controller.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import { requireToken } from "../middlewares/requireToken.js";
import { bodyLoginValidator, bodyRegisterValidator } from "../middlewares/validatorManager.js";

// Middleware (gestiona mejor las rutas)
const router = Router();

// REGISTER
router.post(
    "/register",
    bodyRegisterValidator,
    register
);

// LOGIN
router.post(
    "/login",
    bodyLoginValidator,
    login
);

// RUTAS PROTEGIDAS (EJEMPLOS)
router.get("/protected", requireToken, infoUser);
router.get("/refresh", requireRefreshToken, refreshToken);

// LOGOUT
router.get("/logout", logout)

export default router;
