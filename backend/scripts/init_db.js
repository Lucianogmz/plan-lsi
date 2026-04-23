const pool = require('../config/db');

async function createTables() {
  try {
    console.log("Creando tablas en Neon DB...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS materias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        anio INTEGER NOT NULL,
        cuatrimestre VARCHAR(50),
        correlativas INTEGER[] DEFAULT '{}'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS progreso_usuario (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        materia_id INTEGER REFERENCES materias(id) ON DELETE CASCADE,
        estado VARCHAR(50) DEFAULT 'pendiente',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, materia_id)
      );
    `);

    console.log("✅ Tablas creadas correctamente. La base de datos está lista para usar.");
  } catch (err) {
    console.error("❌ Error creando tablas:", err);
  } finally {
    pool.end();
  }
}

createTables();
