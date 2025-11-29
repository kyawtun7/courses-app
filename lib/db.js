import mysql from "mysql2/promise";

export function getPool() {
  if (!global.pool) {
    global.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      ssl: {
        ca: process.env.DB_SSL_CA,
      },
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  return global.pool;
}
