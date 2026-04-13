const pool = require('../config/db');

const guardarProgreso = async (req, res) => {
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
};

const obtenerProgreso = async (req, res) => {
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
};

module.exports = {
  guardarProgreso,
  obtenerProgreso,
};
