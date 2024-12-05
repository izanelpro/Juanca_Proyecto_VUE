// Zona importar
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rutas from '../src/router/rutas.mjs';

// Crear servidor
const app=express();
const server=http.createServer(app);

//Puerto
app.use(express.json());
app.use('/api',rutas);
app.use(morgan('dev'));


app.get('/',(req,res)=> {
    res.send("Servidor en Marcha");
})
app.set('port',process.env.PORT  || 5000);

server.listen(app.get('port'),()=>{
        console.log("Servidor corriendo en puerto ...",app.get('port'))
})