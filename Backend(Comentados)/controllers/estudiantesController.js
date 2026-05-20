const estudiantesService = require('../services/estudiantesService');
const estudiantesTransform = require('../Transforms/estudiantesTransform');

// 1. BROWSE: Recibe la solicitud para listar alumnos, pide los datos al servicio y los procesa 
// a través de un transformador antes de enviarlos limpios al cliente en formato JSON.
const obtenerTodos = async (_req, res) => {
  try {
    const estudiantesCrudos = await estudiantesService.obtenerTodos();
    const estudiantesLimpios = estudiantesTransform.transformarListaEstudiantes(estudiantesCrudos);
    res.json(estudiantesLimpios);
  } catch (error) {
    console.error("Error en BROWSE:", error.message);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
};

// 2. READ: Solicita un alumno específico al servicio por su ID. Si no se encuentra, 
// responde con un estado 404 para informar al frontend de manera clara.
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await estudiantesService.obtenerPorId(id);
    
    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado o inactivo' });
    }
    res.json(estudiante);
  } catch (error) {
    console.error("Error en READ:", error.message);
    res.status(500).json({ error: 'Error al obtener el estudiante' });
  }
};

// 5. DELETE: Se encarga de procesar la baja del estudiante e informa si la acción se completó correctamente.
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteEliminado = await estudiantesService.eliminar(id);
    
    if (!estudianteEliminado) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado para eliminar' });
    }
    res.json({ mensaje: 'Estudiante dado de baja correctamente', estudiante: estudianteEliminado });
  } catch (error) {
    console.error("Error en DELETE:", error.message);
    res.status(500).json({ error: 'Error al eliminar el estudiante' });
  }
};

// 6. RESTAURAR: Procesa la reactivación del registro del alumno y confirma la operación.
const restaurar = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteRestaurado = await estudiantesService.restaurar(id);
    
    if (!estudianteRestaurado) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado en la base de datos' });
    }
    res.json({ mensaje: 'Estudiante reactivado correctamente', estudiante: estudianteRestaurado });
  } catch (error) {
    console.error("Error en RESTAURAR:", error.message);
    res.status(500).json({ error: 'Error al reactivar el estudiante' });
  }
};

module.exports = { obtenerTodos, obtenerPorId, eliminar, restaurar };