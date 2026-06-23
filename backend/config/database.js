import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const connectDatabase = async () => {
  try {
    const connection = await database.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
const executeQuery = async (query, values = []) => {
  try {
    const [result] = await database.execute(query, values);
    return result;
  } catch (error) {
    console.error("Database Query Error:", error.message);
    throw error;
  }
};
export {
  database,
  connectDatabase,
  executeQuery,
};

