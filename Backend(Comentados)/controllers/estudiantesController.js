const estudiantesService = require('../services/estudiantesService');
const estudiantesTransform = require('../Transforms/estudiantesTransform');

// obtenerTodos: Solicita la lista de alumnos al servicio, la pasa por el transformador 
// para limpiar la estructura de los datos y envía la respuesta final en formato JSON.
const obtenerTodos = async (_req, res) => {
  try {
    const estudiantesCrudos = await estudiantesService.obtenerTodos();
    const estudiantesLimpios = estudiantesTransform.transformarListaEstudiantes(estudiantesCrudos);
    res.json(estudiantesLimpios);
  } catch (error) {
    console.error("Error en obtenerTodos:", error.message);
    res.status(500).json({ error: 'Error al obtener estudiantes' });
  }
};

// obtenerPorId: Busca a un alumno específico mediante el ID recibido en la URL. 
// Si el servicio no devuelve ningún registro, responde con un estado 404 de no encontrado.
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await estudiantesService.obtenerPorId(id);
    
    if (!estudiante) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado o inactivo' });
    }
    res.json(estudiante);
  } catch (error) {
    console.error("Error en obtenerPorId:", error.message);
    res.status(500).json({ error: 'Error al obtener el estudiante' });
  }
};

// crear: Toma los datos enviados en el cuerpo de la petición y llama al servicio para 
// registrar al nuevo estudiante, respondiendo con el estado 201 que indica éxito en la creación.
const crear = async (req, res) => {
  try {
    const datosNuevos = req.body;
    const nuevoEstudiante = await estudiantesService.crear(datosNuevos);
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.error("Error en crear:", error.message);
    res.status(500).json({ error: 'Error al registrar el estudiante' });
  }
};

// actualizar: Recibe el ID de la URL y los nuevos datos para modificar las propiedades del alumno, 
// enviando de vuelta el registro actualizado si el proceso en el servicio fue exitoso.
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    const estudianteModificado = await estudiantesService.actualizar(id, datosActualizados);
    
    if (!estudianteModificado) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado para actualizar' });
    }
    res.json(estudiantesTransform.transformarEstudiante(estudianteModificado));
  } catch (error) {
    console.error("Error en actualizar:", error.message);
    res.status(500).json({ error: 'Error al actualizar el estudiante' });
  }
};

// eliminar: Coordina la baja del estudiante en el sistema. Si la operación se realiza correctamente, 
// retorna un mensaje de confirmación junto con los datos del alumno afectado.
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteEliminado = await estudiantesService.eliminar(id);
    
    if (!estudianteEliminado) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado para eliminar' });
    }
    res.json({ mensaje: 'Estudiante dado de baja correctamente', estudiante: estudianteEliminado });
  } catch (error) {
    console.error("Error en eliminar:", error.message);
    res.status(500).json({ error: 'Error al eliminar el estudiante' });
  }
};

// restaurar: Solicita al servicio la reactivación de un alumno que previamente fue dado de baja 
// y confirma el éxito del procedimiento enviando el registro modificado al cliente.
const restaurar = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteRestaurado = await estudiantesService.restaurar(id);
    
    if (!estudianteRestaurado) {
      return res.status(404).json({ mensaje: 'Estudiante no encontrado en la base de datos' });
    }
    res.json({ mensaje: 'Estudiante reactivado correctamente', estudiante: estudianteRestaurado });
  } catch (error) {
    console.error("Error en restaurar:", error.message);
    res.status(500).json({ error: 'Error al reactivar el estudiante' });
  }
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, restaurar };
