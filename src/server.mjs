import cors from 'cors';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import rutas from '../src/router/rutas.mjs';

const app = express();
// Crear el servidor
const server = http.createServer(app);


// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(rutas);

// Configurar Express para servir archivos estáticos desde "uploads"
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Escuchar el puerto 5000
app.set('port', process.env.PORT || 5000);

// Ruta inicial
app.get('/', (req, res) => {
    res.send('Hola, este es tu servidor!');
});

// Iniciar el server
server.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

// Conectar a MongoDB
mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error al conectar a MongoDB:', err));