// Importamos el servicio que tiene la lógica de negocio
const estudiantesService = require('../services/estudiantesService');

// IMPORTAMOS EL NUEVO DTO
const estudiantesTransform = require('../Transforms/estudiantesTransform');

// Obtiene todos los estudiantes y los pasa por el transformador
const obtenerTodos = async (_req, res) => {
  try {
    // 1. Pedimos los datos "crudos" al servicio
    const estudiantesCrudos = await estudiantesService.obtenerTodos();
    
    // 2. Pasamos los datos por el DTO para limpiarlos
    const estudiantesLimpios = estudiantesTransform.transformarListaEstudiantes(estudiantesCrudos);
    
    // 3. Enviamos la respuesta limpia al frontend
    res.json(estudiantesLimpios);
  } catch (error) {
    console.error("Error en BROWSE:", error.message);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
};

// Busca un estudiante específico por su ID
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
    res.status(500).json({ error: 'Error al buscar el estudiante' });
  }
};

// Crea un nuevo estudiante y transforma la respuesta
const crear = async (req, res) => {
  try {
    const nuevoEstudiante = await estudiantesService.crear(req.body);
    // Se transforma antes de responder para mantener consistencia con el resto de endpoints.
    res.status(201).json(estudiantesTransform.transformarEstudiante(nuevoEstudiante));
  } catch (error) {
    console.error("Error en ADD:", error.message);
    res.status(500).json({ error: 'Error al crear el estudiante' });
  }
};

// Actualiza los datos de un estudiante por su ID
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteActualizado = await estudiantesService.actualizar(id, req.body);
    
    if (!estudianteActualizado) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado para editar' });
    }
    // Se transforma para mantener consistencia con el resto de endpoints.
    res.json(estudiantesTransform.transformarEstudiante(estudianteActualizado));
  } catch (error) {
    console.error("Error en EDIT:", error.message);
    res.status(500).json({ error: 'Error al actualizar el estudiante' });
  }
};

// Da de baja de manera lógica a un estudiante
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

// Reactiva el registro de un estudiante que estaba inactivo
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

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  restaurar
};
