import sql from "mssql";

const PORT = process.env.NEXT_PUBLIC_PORT || 8000;
const DB_NAME = process.env.NEXT_PUBLIC_DB_NAME;
const DB_USERNAME = process.env.NEXT_PUBLIC_DB_USERNAME;
const DB_PASSWORD = process.env.NEXT_PUBLIC_DB_PASSWORD;
const DB_SERVER = process.env.NEXT_PUBLIC_DB_SERVER;

const config = {
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
    console.error("Database connection failed:", err);
    throw new Error("Database connection failed");
  }
}
