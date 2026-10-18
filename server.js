const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
// Configuración de la conexión a MySQL usando la URL de Railway
const db = mysql.createPool(
    process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || {
        host: process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost',
        user: process.env.MYSQL_USER || process.env.MYSQLUSER || 'root',
        password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || '',
        database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'railway',
        port: process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
});


// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    const sql = 'SELECT * FROM productos';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Ruta para registrar los pedidos que envía el carrito
app.post('/api/pedidos', (req, res) => {
    const { cliente_nombre, total, carrito } = req.body;

    if (!carrito || carrito.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío" });
    }

    const sqlPedido = 'INSERT INTO pedidos (cliente_nombre, total) VALUES (?, ?)';

    db.query(sqlPedido, [cliente_nombre || 'Cliente Kaffa', total], (err, result) => {
        if (err) {
            console.error("Error al registrar pedido:", err);
            return res.status(500).json({ error: err.message });
        }

        const pedidoId = result.insertId;
        res.json({ mensaje: "¡Pedido registrado con éxito!", pedidoId });
    });
});

// Arrancar el servidor usando el puerto dinámico de Railway o 3000 por defecto para local
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});