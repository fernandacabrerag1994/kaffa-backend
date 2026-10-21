const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión con la base de datos MySQL de Railway
const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

const db = dbUrl
    ? mysql.createPool(dbUrl)
    : mysql.createPool({
        host: process.env.MYSQLHOST || process.env.MYSQL_HOST,
        user: process.env.MYSQLUSER || process.env.MYSQL_USER,
        password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD,
        database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
        port: process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306
    });

// Ruta para obtener todos los productos reales
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            console.error('Error al consultar productos:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Ruta para recibir y procesar la compra del carrito
app.post('/api/pedidos', (req, res) => {
    const { cliente_nombre, subtotal, iva, total, carrito } = req.body;

    console.log('Pedido recibido:', { cliente_nombre, subtotal, iva, total, carrito });

    res.json({
        mensaje: '¡Pedido registrado con éxito!',
        total: total
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});