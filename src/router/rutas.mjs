import express from 'express';
import Articulo  from '../modelos/modelos.js';
import mongoose  from 'mongoose';
import path from 'path';
import multer from 'multer';
import Stripe from 'stripe';
import 'dotenv/config';
import nodemailer from 'nodemailer';
//XD
console.log(Articulo)

const rutas = express.Router();


const stripe = new Stripe(process.env.VUE_APP_STRIPE_SECRET_KEY)


// Configuración de multer
// Función para crear la configuración de almacenamiento (storage)
const createStorage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folder);  // Se define la carpeta de destino dinámicamente
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Nombre único para cada archivo
    }
});

// Validar que el archivo sea PNG o JPG (para imágenes)
const imageFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        cb(null, true);  // Aceptar el archivo
    } else {
        cb(new Error('Solo se permiten archivos PNG o JPG'), false);  // Rechazar el archivo
    }
};

// Validar que el archivo sea PDF (para los CV)
const cvFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
        cb(null, true);  // Aceptar el archivo
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);  // Rechazar el archivo
    }
};

// Ruta para subir imágenes
const uploadImage = multer({
    storage: createStorage('uploads/img'),  // Carpeta de destino para imágenes
    fileFilter: imageFileFilter,  // Filtro para imágenes
    limits: { fileSize: 5 * 1024 * 1024 }  // Límite de 5MB
});

// Ruta para subir CVs (solo PDF)
const uploadCV = multer({
    storage: createStorage('uploads/cv'),  // Carpeta de destino para CVs
    fileFilter: cvFileFilter,  // Filtro para PDFs
    limits: { fileSize: 10 * 1024 * 1024 }  // Límite de 10MB
});

// Definir rutas para subir imágenes y CVs
rutas.post('/subirimg', uploadImage.single('image'), (req, res) => {
    // Manejar la subida de imagen
    res.status(200).json({ message: 'Imagen subida correctamente', file: req.file });
});
// Ruta para gestionar la subida de archivos
rutas.post('/subircv', uploadCV.single('archivo'), (req, res) => {
    console.log('Archivo recibido:', req.file);
    console.log('Candidato ID:', req.body.candidatoId);
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ningún archivo' });
    }
    // Responder con el archivo subido y su ubicación
    res.status(200).json({
      mensaje: 'Archivo subido con éxito',
      archivo: req.file,
    });
  });



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
        const articulo = new Articulo.default(req.body);
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

// Ruta para crear la sesión de checkout
rutas.post('/crear-checkout-session', async (req, res) => {
    try {
        const { items, amount } = req.body;  // Recibimos los items y el monto total

        // Verificar que los datos recibidos son válidos
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Debe haber al menos un producto en el carrito." });
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Monto inválido" });
        }

        // Crear los items de la línea para la sesión de pago
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'eur',  // La moneda en que se va a pagar
                product_data: {
                    name: item.nombre,  // Nombre del producto
                },
                unit_amount: item.precio_unitario * 100,  // Convertimos el precio a céntimos
            },
            quantity: item.cantidad,  // Cantidad del producto en el carrito
        }));

        // Crear la sesión de pago en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,  // Pasamos los items del carrito
            mode: 'payment',
            success_url: "http://localhost:8080/success",  // URL de éxito
            cancel_url: "http://localhost:8080/cancel",  // URL de cancelación
        });

        // Respondemos con el ID de la sesión de Stripe
        res.json({ id: session.id });

    } catch (error) {
        console.error("Error al crear la sesión de pago:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
    }
});

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

rutas.post('/enviar-correo', (req, res) => {
    console.log("Datos Recibidos: ", req.body);
    const { nombre, telefono, email, mensaje } = req.body;

    const mailOptions = {
        from: email,
        to: 'izanlage161005@gmail.com', // aquí pones una dirección existente para probar
        subject: 'Mensaje de contacto',
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nMensaje: ${mensaje}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo:", error);
            return res.status(500).json({ error: 'Error al enviar el mensaje, por favor inténtelo nuevamente.' });
        } else {
            console.log('Email enviado: ' + info.response);
            return res.status(200).json({ message: 'Mensaje enviado correctamente' });
        }
    });
});

export default rutas;