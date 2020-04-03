import pool from "../model";

const createTables = `
  CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   email VARCHAR,
   password VARCHAR,
   is_admin BOOLEAN
  );
  CREATE TABLE IF NOT EXISTS rooms (
   ID SERIAL PRIMARY KEY,
   type VARCHAR,
   cost_per_night FLOAT,
   number_of_beds INT,
   status VARCHAR
  );
  CREATE TABLE IF NOT EXISTS bookings (
   id SERIAL PRIMARY KEY,
   room_id INT,
   checkout_date DATE,
   checkin_date DATE
  );
`;
const createDatabaseTables = async () => {
  await pool.query(createTables).then(() => {
    console.log("Tables successfully created");
  });
};

createDatabaseTables();
