const express = require('express');
const router = express.Router();
const materiasController = require('../controllers/materiasController');

// Ruta para obtener todas las materias
router.get('/', materiasController.obtenerMaterias);

module.exports = router;
