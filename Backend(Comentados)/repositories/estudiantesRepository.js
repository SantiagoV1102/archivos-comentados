const pool = require('../config/db');

// obtenerTodos: Consulta la base de datos para traer la lista completa de alumnos ordenados por su ID.
const obtenerTodos = async () => {
  const resultado = await pool.query('SELECT * FROM estudiantes ORDER BY id_estudiante ASC');
  return resultado.rows;
};
 
// obtenerPorId: Busca a un alumno específico según su ID. Usamos parámetros ($1) para asegurar 
// la consulta y proteger el sistema contra inyecciones SQL.
const obtenerPorId = async (id) => {
  const resultado = await pool.query('SELECT * FROM estudiantes WHERE id_estudiante = $1', [id]);
  return resultado.rows[0];
};

// crear: Inserta un nuevo registro en la tabla de estudiantes con los datos que llegan del frontend, 
// asignándole un estado activo inicial y guardando la fecha y hora exacta de la operación.
const crear = async (datos) => {
  const { documento, apellido, nombres, email, fecha_nacimiento } = datos;
  const consulta = `
    INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion) 
    VALUES ($1, $2, $3, $4, $5, 1, 1, CURRENT_TIMESTAMP) RETURNING *
  `;
  const valores = [documento, apellido, nombres, email, fecha_nacimiento];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

// actualizar: Modifica los datos de un alumno existente en base a su ID y registra el momento 
// exacto en el que se realizó la actualización.
const actualizar = async (id, datos) => {
  const { documento, apellido, nombres, email, fecha_nacimiento} = datos;
  const consulta = `
    UPDATE estudiantes 
    SET documento = $1, apellido = $2, nombres = $3, email = $4, fecha_nacimiento = $5, 
        id_usuario_modificacion = 1, fecha_hora_modificacion = CURRENT_TIMESTAMP
    WHERE id_estudiante = $6 RETURNING *
  `;
  const valores = [documento, apellido, nombres, email, fecha_nacimiento, id];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

// eliminar: Realiza una baja lógica cambiando el estado del alumno a inactivo (activo = 0). 
// Hacemos esto en lugar de borrarlo físicamente para resguardar la integridad de los datos históricos de la BD.
const eliminar = async (id) => {
  const consulta = `
    UPDATE estudiantes 
    SET activo = 0, 
      fecha_hora_modificacion = CURRENT_TIMESTAMP,
      id_usuario_modificacion = 1
    WHERE id_estudiante = $1 RETURNING *
  `;
  const resultado = await pool.query(consulta, [id]);
  return resultado.rows[0];
};

// restaurar: Revierte la baja lógica volviendo a activar al alumno (activo = 1) en caso de que 
// necesite ser reincorporado al sistema.
const restaurar = async (id) => {
  const consulta = `
    UPDATE estudiantes 
    SET activo = 1, 
      fecha_hora_modificacion = CURRENT_TIMESTAMP,
      id_usuario_modificacion = 1
    WHERE id_estudiante = $1 RETURNING *
  `;
  const resultado = await pool.query(consulta, [id]);
  return resultado.rows[0];
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, restaurar };
