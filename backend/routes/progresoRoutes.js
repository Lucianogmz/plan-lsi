const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/progresoController');

// Ruta para guardar o actualizar progreso (userId viene del JWT)
router.post('/', progresoController.guardarProgreso);

// Ruta para obtener el progreso del usuario autenticado
router.get('/', progresoController.obtenerProgreso);

module.exports = router;
