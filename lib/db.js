// lib/db.js
import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    if (process.env.DATABASE_URL) {
      // TiDB (production / cloud)
      // DATABASE_URL is the mysql://... string from TiDB UI
      pool = mysql.createPool(process.env.DATABASE_URL);
    } else {
      // Local dev with XAMPP (fallback)
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'courses_app',
        port: Number(process.env.DB_PORT || 3306),
        connectionLimit: 10,
      });
    }
  }
  return pool;
}
