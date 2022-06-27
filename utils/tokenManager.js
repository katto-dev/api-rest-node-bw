import jwt from "jsonwebtoken"

export const generateToken = (uid) => {
    //const expiresIn = 60 * 15;
    const expiresIn = 60 * 60 * 24 * 30;

    try {
        // Generamos el token
        const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });
        return { token, expiresIn }
    } catch (error) {
        console.log(error)
    }
}

export const generateRefreshToken = (uid, res) => {
    const expiresIn = 60 * 60 * 24 * 30;

    try {
        // Generamos el refreshToken
        const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn });
        
        // Guardamos el refreshToken en una cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODE === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000)
        });
    } catch (error) {
        console.log(error)
    }
}

export const tokenVerificationErrors = {
    "invalid signature": "La firma del JWT no es válida",
    "jwt expired": "JWT expirado",
    "invalid token": "Token no válido",
    "No Bearer": "Utiliza formato Bearer",
    "jwt malformed": "JWT formato no válido (requireToken)"
}