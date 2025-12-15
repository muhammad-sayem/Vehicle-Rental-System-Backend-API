import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL CHECK(email = LOWER(email)),
      password TEXT NOT NULL CHECK(LENGTH(password) >= 6),
      phone VARCHAR(20) UNIQUE NOT NULL,
      role VARCHAR(50) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      registration_number VARCHAR(50) UNIQUE NOT NULL,
      daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC NOT NULL,
      status VARCHAR(50) NOT NULL
    )
  `)

}

export default initDB;