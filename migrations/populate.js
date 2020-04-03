import pool from "../model";
import Helper from "../Helpers/helpers";
import dotenv from "dotenv";

dotenv.config();
const pass = process.env.password;
const pass1 = process.env.password1;
const password = Helper.hashPassword(pass);
const password1 = Helper.hashPassword(pass1);

const populate = `
INSERT INTO users (email, password, is_admin) VALUES ('ojoabiola@gmail.com','${password}',true);
INSERT INTO users (email, password, is_admin) VALUES ('doyin@gmail.com','${password1}',false);
INSERT INTO rooms (type, number_of_beds, cost_per_night, status) VALUES ('dorm room',4,4000,'unavailable');
INSERT INTO rooms (type, number_of_beds, cost_per_night, status) VALUES ('mixed dorm room',4,4000,'available');
INSERT INTO rooms (type, number_of_beds, cost_per_night, status) VALUES ('deluxe room',1,15000,'available');
INSERT INTO rooms (type, number_of_beds, cost_per_night, status) VALUES ('standard room',2, 10000,'available');
INSERT INTO rooms (type, number_of_beds, cost_per_night, status) VALUES ('mixed dorm room',8, 8000,'unavailable');
INSERT INTO bookings (room_id, checkout_date, checkin_date) VALUES (1,'2020-03-02', '2020-03-01');
INSERT INTO bookings (room_id, checkout_date, checkin_date) VALUES (5,'2020-03-04', '2020-03-01');
`;
const seedDatabase = async () => {
  await pool.query(populate).then(() => {
    console.log("tables Successfully populated");
  });
};

seedDatabase();
