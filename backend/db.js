const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Miamor0908',
  database: process.env.DB_NAME || 'soporte_tickets',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión establecida con la base de datos MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión con MySQL:', err.message);
  });

module.exports = pool;