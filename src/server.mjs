// Zona importar
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rutas from '../src/router/rutas.mjs';
import cors from 'cors';

// Crear servidor
const app=express();
const server=http.createServer(app);

//Puerto
app.use(cors());
app.use(express.json());
app.use(rutas);
app.use(morgan('dev'));


app.get('/',(req,res)=> {
    res.send("Servidor en Marcha");
})
app.set('port',process.env.PORT  || 5000);

server.listen(app.get('port'),()=>{
        console.log("Servidor corriendo en puerto ...",app.get('port'))
})
mongoose.connect("mongodb://root:abc123@localhost:27017/bbdd?authSource=admin")
    .then(()=> console.log("Conectado a MongoDB"))
    .catch(err=> console.log("Error conexión",err))