// Backend/routes/estudiantesRoutes.js

const express = require('express');
const router = express.Router();

// Importamos el controlador y el validador
const estudiantesController = require('../controllers/estudiantesController');
const estudiantesValidator = require('../validators/estudiantesValidator');

// 1. BROWSE
router.get('/', estudiantesController.obtenerTodos);

// 2. READ
router.get('/:id', estudiantesController.obtenerPorId);

// 3. ADD 
router.post('/', estudiantesValidator.validarDatosEstudiante, estudiantesController.crear);

// 4. EDIT
router.put('/:id', estudiantesValidator.validarDatosEstudiante, estudiantesController.actualizar);

// 5. DELETE
router.delete('/:id', estudiantesController.eliminar);

// 6. RESTAURAR
router.patch('/:id/activar', estudiantesController.restaurar);

module.exports = router;