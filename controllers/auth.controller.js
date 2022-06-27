import { User } from '../models/User.js'
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';

// REGISTER
export const register = async (req, res) => {
    //console.log(req.body.email)
    const { email, password } = req.body;

    try {
        // Error: alternativa buscando por email
        let user = await User.findOne({ email });
        //console.log('findOne: ', user)
        if(user) throw ({ code: 11000 })

        user = new User({ email, password});
        await user.save();

        // Generar el token con JWT
        const { token, expiresIn} = generateToken(user.id);
        // Generar el refresh token (con el res podemos usar la cookie)
        generateRefreshToken(user.id, res);

        return res.status(201).json({ ok: 'Usuario registrado', token, expiresIn })

    } catch (error) {
        //console.log(error.code)
        // Error: alternativa por defecto mongoose
        if(error.code === 11000) {
            return res.status(400).json({ error: "Ya existe este usuario" })
        }
        return res.status(500).json({ error: "Error de servidor" })
    }
}

// LOGIN
export const login = async (req, res) => {
    console.log("Entro aqui ===> ?")
    const { email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if(!user) return res.status(403).json({ error: "No existe este usuario" });

        const respuetaPassword = await user.comparePassword(password);
        if(!respuetaPassword) return res.status(403).json({ error: "Contraseña incorrecta" });

        // Generar el token con JWT
        const { token, expiresIn} = generateToken(user.id);
        // Generar el refresh token (con el res podemos usar la cookie)
        generateRefreshToken(user.id, res);
        
        return res.json({ ok: 'Login', token, expiresIn });

    } catch (error) {
        //console.log(error.code)
    }
    return res.status(500).json({ error: "Error de servidor" })
}

// RUTA PROTEGIDA
export const infoUser = async (req, res) => {
    try {
        const user = await User.findById(req.uid).lean();
        return res.json({ uid: user.id, email: user.email });

    } catch (error) {
        //console.log(error)
        return res.status(500).json({ error: "Error en el servidor" });
    }
}

// RUTA REFRESH
export const refreshToken = (req, res) => {
    try {
        // Generamos el token con JWT
        const { token, expiresIn } = generateToken(req.uid);

        // Devolvermos ese token a la vista
        return res.json({ token, expiresIn });
    } catch (error) {
        //console.log(error);
        return res.status(500).json({ error: "Error en el servidor" });
    }
}

export const logout = (req, res) => {
    // Destruimos las cookies
    res.clearCookie('refreshToken');
    res.json({ ok: true })
}