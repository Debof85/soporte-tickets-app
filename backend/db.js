
const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar conexión con MySQL
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión establecida con MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión con MySQL:', err.message);
  });

module.exports = pool;
