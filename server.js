const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL Workbench
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789', // 
    database: 'kaffa_db'
});

// Probar la conexión
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err.message);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos kaffa_db!');
});

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    const sql = `
        SELECT p.id, p.nombre, p.precio_chico, p.precio_mediano, p.precio_grande, p.precio, c.nombre AS categoria
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Arrancar el servidor en el puerto 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});