// lib/db.js
// Works with both local MySQL (XAMPP) and TiDB Cloud,
// controlled by environment variables.

import mysql from "mysql2/promise";

let pool;

/**
 * Internal helper to create a MySQL/TiDB pool based on env vars.
 * - Uses DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, DB_SSL
 * - If DB_SSL = "true", enable TLS (needed for TiDB Cloud)
 */
function createPool() {
  const useTLS =
    (process.env.DB_SSL || "").toString().toLowerCase() === "true";

  const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    // Support both DB_PASS (lecture slide) and DB_PASSWORD (older env)
    password: process.env.DB_PASS ?? process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "courses_app",
    port: Number(process.env.DB_PORT || (useTLS ? 4000 : 3306)),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  if (useTLS) {
    // Required by TiDB Cloud
    config.ssl = {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    };
  }

  return mysql.createPool(config);
}

/**
 * Preferred way: call getPool() inside your API routes.
 */
export function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}

/**
 * For compatibility with the lecture slide style:
 * const { mysqlPool } = require("../lib/db");
 */
export const mysqlPool = getPool();
