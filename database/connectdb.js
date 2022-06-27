import 'dotenv/config';
import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log('Conexión a MongoBD... OK')    
} catch (error) {
    console.log('Error de conexión a mongodb: ' + error);
}
