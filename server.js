const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/productos', (req, res) => {
    res.json([
        { id: 1, nombre: 'Café de Prueba', precio: 50, categoria: 'Café Caliente' }
    ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});