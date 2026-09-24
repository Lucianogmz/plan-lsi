const express = require('express');
const cors = require('cors');
require('dotenv').config();

const materiasRoutes = require('./routes/materiasRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/materias', materiasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
