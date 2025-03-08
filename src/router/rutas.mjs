import express from 'express';
import Articulo from '../modelos/modelos.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

console.log(Articulo);

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos subidos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
  }
});

const upload = multer({ storage: storage });

const rutas = express.Router();

// Rutas ya definidas

// como establecer una ruta

rutas.get('/articulos', async (req, res) => {
    try{
        const articulos = await Articulo.default.find({});
        res.json(articulos);

    } catch(error){
        res.status(500).json({message: error.message});
        console.log("Error al obtener artículos:", error);
    }
});

rutas.post('/articulos', async (req, res) => {
    try{
        const articulo = new Articulo(req.body);
        await articulo.save();
        res.status(201).json(articulo);
        console.log("Artículo guardado correctamente");
    } 
    catch(error){
        res.status(400).json({message: error.message});
        console.log("Error al guardar artículo:", error);
        }
    });

rutas.put('/articulos/:id', async (req, res) => { 
    try {
        const { id } = req.params;
        console.log("ID recibido:", id);


        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('No hay artículo con ese ID');
        }

        // Intentar encontrar y actualizar el artículo
        const articulo = await Articulo.default.findByIdAndUpdate(id, req.body, { new: true });

        // Si no se encuentra el artículo
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        // Responder con el artículo actualizado
        res.json(articulo);
        console.log("Artículo actualizado correctamente");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al actualizar artículo:", error);
    }
});

rutas.delete('/articulos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido:", id);

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('No hay artículo con ese ID');
        }

        // Intentar encontrar y eliminar el artículo
        const articulo = await Articulo.default.findByIdAndDelete(id);

        // Si no se encuentra el artículo
        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        // Responder con el artículo eliminado
        res.json(articulo);
        console.log("Artículo eliminado correctamente");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al eliminar artículo:", error);
    }   
});


// Ruta para subir un archivo CV
rutas.post('/subircv', upload.single('cv'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo');
    }

    // Si el archivo se subió correctamente
    res.send(`Archivo subido exitosamente: ${req.file.filename}`);
});

export default rutas;
