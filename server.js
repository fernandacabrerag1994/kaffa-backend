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

// Ruta para recibir y guardar los pedidos en MySQL
app.post('/api/pedidos', (req, res) => {
    const { cliente_nombre, subtotal, iva, total, carrito } = req.body;
    const nombreCliente = cliente_nombre || 'Cliente Kaffa';

    // 1. Insertar el pedido principal
    const queryPedido = 'INSERT INTO pedidos (cliente_nombre, subtotal, iva, total) VALUES (?, ?, ?, ?)';

    db.query(queryPedido, [nombreCliente, subtotal, iva, total], (err, resultadoPedido) => {
        if (err) {
            console.error('Error al guardar el pedido:', err);
            return res.status(500).json({ error: err.message });
        }

        const pedidoId = resultadoPedido.insertId;

        // Si el carrito está vacío, terminamos aquí
        if (!carrito || carrito.length === 0) {
            return res.json({ mensaje: '¡Pedido registrado con éxito!', pedidoId });
        }

        // 2. Insertar los productos del carrito en detalle_pedidos
        const queryDetalle = 'INSERT INTO detalle_pedidos (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad) VALUES ?';

        const detalles = carrito.map(item => [
            pedidoId,
            item.id,
            item.nombre,
            item.precio,
            item.cantidad
        ]);

        db.query(queryDetalle, [detalles], (errDetalle) => {
            if (errDetalle) {
                console.error('Error al guardar el detalle del pedido:', errDetalle);
                return res.status(500).json({ error: errDetalle.message });
            }

            res.json({
                mensaje: '¡Pedido y productos guardados con éxito en la base de datos!',
                pedidoId: pedidoId
            });
        });
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});