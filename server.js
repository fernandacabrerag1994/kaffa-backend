const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para saber si el servidor responde
app.get('/api/productos', (req, res) => {
    res.json([
        { id: 1, nombre: 'Café de Prueba', precio: 50, categoria: 'Café Caliente' }
    ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de prueba corriendo en el puerto ${PORT}`);
});