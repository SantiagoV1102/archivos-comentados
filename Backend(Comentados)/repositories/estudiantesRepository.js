const pool = require('../config/db');

// 1. BROWSE: Consulta la base de datos para traer la lista completa de estudiantes ordenados por ID.
const obtenerTodos = async () => {
  const resultado = await pool.query('SELECT * FROM estudiantes ORDER BY id_estudiante ASC');
  return resultado.rows;
};
 
// 2. READ: Busca un estudiante específico por su ID. Usamos parámetros ($1) para proteger la consulta de ataques SQL.
const obtenerPorId = async (id) => {
  const resultado = await pool.query('SELECT * FROM estudiantes WHERE id_estudiante = $1', [id]);
  return resultado.rows[0];
};

// 3. ADD: Registra un nuevo estudiante en la base de datos con los datos que llegan del formulario.
const crear = async (datos) => {
  const { documento, apellido, nombres, email, fecha_nacimiento } = datos;
  
  // Guardamos el registro asignándole un estado activo (1) y la fecha y hora exacta de la creación.
  const consulta = `
    INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion) 
    VALUES ($1, $2, $3, $4, $5, 1, 1, CURRENT_TIMESTAMP) RETURNING *
  `;
  const valores = [documento, apellido, nombres, email, fecha_nacimiento];
  const resultado = await pool.query(consulta, valores);
  return resultado.rows[0];
};

// 4. EDIT: Modifica los datos de un estudiante existente según su ID y actualiza el registro de modificación.
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

// 5. DELETE: Aplicamos una baja lógica (activo = 0) en lugar de borrar el registro físicamente. 
// Esto evita que se rompa el historial si el alumno ya está asociado a un curso o nota.
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

// 6. RESTAURAR: Permite reactivar la cuenta de un estudiante (activo = 1) si fue dado de baja previamente.
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