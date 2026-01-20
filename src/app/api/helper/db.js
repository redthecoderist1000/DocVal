import sql from "mssql";

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_SERVER = process.env.DB_SERVER;

const config = {
  port: parseInt(PORT, 10),
  user: DB_USERNAME,
  password: DB_PASSWORD,
  server: DB_SERVER,
  database: DB_NAME,
  options: {
    encrypt: false,
  },
};

let poolPromise;

// Create a singleton connection pool
export async function getConnection() {
  try {
    if (!poolPromise) {
      poolPromise = sql.connect(config);
    }
    return await poolPromise;
  } catch (err) {
    console.error("Database connection failed:", err.message || err);
    console.error("Config:", {
      server: DB_SERVER,
      database: DB_NAME,
      user: DB_USERNAME,
    });
    throw err;
  }
}
