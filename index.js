import 'dotenv/config';
import './database/connectdb.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import linkRouter from './routes/link.route.js'
import redirectRouter from './routes/redirect.route.js'

const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2]

app.use(cors({
    origin: function(origin, callback){
        console.log("Origin ==> ", origin)
        if(!origin || whiteList.includes(origin)){
            return callback(null, origin)
        }
        return callback(
            "Error de CORS origin: " + origin + " No autorizado!"
        );
    }
}));

// Habilitamos la posibilidad de leer en JSON
app.use(express.json());
// Habilitamos el uso de Cookies
app.use(cookieParser());


// Middleware - Ejemplo backend redirect (opcional)
app.use("/", redirectRouter);
// MIDDLEWARES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);

// Mini frontend SOLO para Login/token (cuidado pisa el "/")
//app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Servidor corriendo... http://localhost:" + PORT));
