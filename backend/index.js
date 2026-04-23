const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const materiasRoutes = require('./routes/materiasRoutes');
const progresoRoutes = require('./routes/progresoRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);

// Rutas protegidas (requieren JWT)
app.use('/api/progreso', authMiddleware, progresoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});