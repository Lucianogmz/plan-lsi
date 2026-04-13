const express = require('express');
const router = express.Router();
const progresoController = require('../controllers/progresoController');

// Ruta para guardar o actualizar progreso
router.post('/', progresoController.guardarProgreso);

// Ruta para obtener el progreso de un usuario específico
router.get('/:user_id', progresoController.obtenerProgreso);

module.exports = router;
