import pool from "../model";

const dropTables = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

`;

const dropDatabase = async () => {
  await pool.query(dropTables).then(() => {
    console.log("Tables successfully removed from Database");
  });
};

dropDatabase();
