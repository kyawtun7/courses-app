// lib/db.js
import mysql from "mysql2/promise";

let pool;

/**
 * Shared MySQL pool for both local (XAMPP) and Vercel (TiDB).
 *
 * - Local: no SSL, default host/user/password if env missing
 * - Vercel: uses SSL CA from DB_SSL_CA (required by TiDB)
 */
export function getPool() {
  if (!pool) {
    const useSSL = !!process.env.DB_SSL_CA; // true on Vercel, false on local

    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      // support both DB_PASSWORD (Vercel) and DB_PASS (.env.local)
      password:
        process.env.DB_PASSWORD ??
        process.env.DB_PASS ??
        "",
      database: process.env.DB_NAME || "courses_app",
      port: Number(process.env.DB_PORT || 3306),
      waitForConnections: true,
      connectionLimit: 10,
      ssl: useSSL
        ? {
            // Vercel / TiDB: certificate from env var
            ca: process.env.DB_SSL_CA,
          }
        : undefined, // Local: no SSL
    });
  }

  return pool;
}
