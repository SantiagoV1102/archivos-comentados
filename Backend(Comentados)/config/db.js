const { Pool } = require('pg');

// Inicializamos el Pool de conexiones hacia PostgreSQL.
// Usamos "Pool" en lugar de una conexión única (Client) para que el servidor 
// pueda abrir y reutilizar varios canales a la vez, evitando que la app se cuelgue 
// si entran muchas consultas juntas desde el frontend.
const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',      
  database: 'fcad_cursos', 
  password: '8520',       
  port: 5432,             
});

// Exportamos el pool para que los repositorios puedan importar este archivo 
// y ejecutar sus consultas SQL directamente sobre la base de datos.
module.exports = pool;