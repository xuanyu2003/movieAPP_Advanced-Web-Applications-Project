import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
    
    console.log("Connecting to database:", process.env.DB_NAME)
    console.log("Connecting to port:", process.env.DB_PORT)

} else {

    console.log(
    `Connecting to database: ${
      process.env.NODE_ENV === "development" ? process.env.DB_NAME : process.env.TEST_DB_NAME
    }`
  );

  console.log(
    `Database Port: ${
      process.env.NODE_ENV === "development" ? process.env.DB_PORT : process.env.TEST_DB_PORT
    }`
  );
  }

const { Pool } = pkg;

let openDb;

if (isProduction) {
  openDb = () => {
    return new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  };

} else {
  openDb = () => {
    return new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.NODE_ENV === "development" ? process.env.DB_NAME : process.env.TEST_DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.NODE_ENV === "development" ? process.env.DB_PORT : process.env.TEST_DB_PORT,
    });
  };
}

const pool = openDb();

export { pool };
