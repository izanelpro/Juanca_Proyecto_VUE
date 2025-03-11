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


app.post('/crear-checkout-session', async (req, res) => {
    try {
        const { items, amount } = req.body; // La cantidad que se va a pagar (en centavos)

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Debe enviar al menos un producto a pagar' });
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Debe enviar un monto válido a pagar' });
        }

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.nombre,
                },
                unit_amount: item.precio_unitario * 100,
              },
              quantity: item.cantidad,
        }));
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:8080/success',
            cancel_url: 'http://localhost:8080/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error al crear la sesión de pago:', error);
        res.status(500).json({ message: 'Error al crear la sesión de pago' });
    }
});



// Conectar a MongoDB
mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error al conectar a MongoDB:', err));