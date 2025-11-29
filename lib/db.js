// lib/db.js
import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (!pool) {
    // TiDB / production / cloud (and you can also use this locally)
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 4000),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        // REQUIRED for TiDB Cloud
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
      connectionLimit: 10,
    });
  }
  return pool;
}
