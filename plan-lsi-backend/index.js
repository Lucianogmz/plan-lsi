const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Postgres
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ruta para obtener todas las materias
app.get('/api/materias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materias ORDER BY anio, id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

const PORT = process.env.PORT || 3001;

// Ruta para guardar o actualizar el estado de una materia
app.post('/api/progreso', async (req, res) => {
  const { user_id, materia_id, estado } = req.body;

  try {
    const query = `
      INSERT INTO progreso_usuario (user_id, materia_id, estado)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, materia_id) 
      DO UPDATE SET estado = EXCLUDED.estado, updated_at = CURRENT_TIMESTAMP;
    `;
    await pool.query(query, [user_id, materia_id, estado]);
    res.status(200).json({ mensaje: "Progreso guardado correctamente" });
  } catch (err) {
    console.error("Error al guardar progreso:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener el progreso de un usuario específico
app.get('/api/progreso/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT materia_id, estado FROM progreso_usuario WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener progreso:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
console.log("¡LAS RUTAS NUEVAS ESTÁN CARGADAS!");
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});