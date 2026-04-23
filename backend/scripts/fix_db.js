const pool = require('../config/db');

async function fixDB() {
  try {
    console.log("Arreglando claves foráneas en Neon DB...");
    
    // Primero, averiguar el nombre de las constraints
    // Las constraints generadas suelen llamarse "progreso_usuario_user_id_fkey"
    
    // 1. Borrar todas las referencias y limpiar progreso_usuario
    // Como las tablas pueden tener nombres mixtos, es mejor dropear y recrear
    console.log("Dropping progreso_usuario...");
    await pool.query('DROP TABLE IF EXISTS progreso_usuario;');
    
    // 2. Recrear progreso_usuario refiriendo a users
    console.log("Recreando progreso_usuario hacia users(id)...");
    await pool.query(`
      CREATE TABLE progreso_usuario (
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        materia_id VARCHAR(255) REFERENCES materias(id) ON DELETE CASCADE,
        estado VARCHAR(50) DEFAULT 'pendiente',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, materia_id)
      );
    `);
    
    console.log("✅ Arreglo completado.");
  } catch (err) {
    console.error("❌ Error arreglando tablas:", err);
  } finally {
    pool.end();
  }
}

fixDB();
