const pool = require('../config/db');

const obtenerMaterias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materias ORDER BY anio, id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = {
  obtenerMaterias,
};
