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
  connectionTimeout: 45000,
  requestTimeout: 30000,
  options: {
    encrypt: false,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise;

async function createPool() {
  const pool = new sql.ConnectionPool(config);
  pool.on("error", (err) => {
    console.error("SQL pool error:", err.message || err);
    poolPromise = null;
  });
  await pool.connect();
  return pool;
}

// Create a singleton connection pool
export async function getConnection() {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      if (!poolPromise) {
        poolPromise = createPool();
      }
      return await poolPromise;
    } catch (err) {
      lastError = err;
      poolPromise = null;
      const waitMs = 500 * attempt;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  console.error("Database connection failed:", lastError?.message || lastError);
  console.error("Config:", {
    server: DB_SERVER,
    database: DB_NAME,
    user: DB_USERNAME,
  });
  throw lastError;
}
