const express = require('express');
const cors = require('cors');
require('dotenv').config();

const materiasRoutes = require('./routes/materiasRoutes');
const progresoRoutes = require('./routes/progresoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Main Routes Mounting
app.use('/api/materias', materiasRoutes);
app.use('/api/progreso', progresoRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});