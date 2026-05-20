// Backend/routes/estudiantesRoutes.js

const express = require('express');
const router = express.Router();

// Importamos el controlador y el validador
const estudiantesController = require('../controllers/estudiantesController');
const estudiantesValidator = require('../validators/estudiantesValidator');

// obtenerTodos: Maneja la petición GET en la raíz. Devuelve el listado completo de los alumnos del sistema.
router.get('/', estudiantesController.obtenerTodos);

// obtenerPorId: Recibe un ID como parámetro en la URL para buscar y mostrar los detalles de un solo estudiante.
router.get('/:id', estudiantesController.obtenerPorId);

// crear: Procesa la creación de un nuevo estudiante mediante una petición POST. 
// Primero pasa por el middleware de validación para controlar los datos y luego llega al controlador.
router.post('/', estudiantesValidator.validarDatosEstudiante, estudiantesController.crear);

// actualizar: Modifica los datos de un alumno existente mediante PUT usando su ID. 
// También valida la estructura de los datos entrantes antes de impactar los cambios.
router.put('/:id', estudiantesValidator.validarDatosEstudiante, estudiantesController.actualizar);

// eliminar: Ejecuta la baja del estudiante mediante DELETE. El controlador se encargará 
// de hacer la desactivación lógica en la base de datos en lugar de un borrado físico.
router.delete('/:id', estudiantesController.eliminar);

// restaurar: Utiliza el método PATCH para realizar una modificación parcial en el estado del alumno, 
// permitiendo reactivar su registro en el sistema.
router.patch('/:id/activar', estudiantesController.restaurar);

module.exports = router;
