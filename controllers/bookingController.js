import pool from "../model";
import Helper from "../Helpers/helpers";
import jwt from "jsonwebtoken";

export const checkRooms = async (req, res) => {
  const { noOfGuest, checkInDate, checkOutDate } = req.body;
  let data;
  const allRooms = await pool.query(
    "SELECT * FROM rooms WHERE status = $1 AND number_of_beds >= $2",
    ["available", noOfGuest]
  );
  data = allRooms.rows;
  const availableRoomId = await pool.query(
    "SELECT room_id FROM bookings WHERE checkout_date <= $1",
    [checkInDate]
  );
  const rooms = availableRoomId.rows.map(async res => {
    const room = await pool.query(
      "SELECT * FROM rooms WHERE id = $1 AND number_of_beds >= $2",
      [res.room_id, noOfGuest]
    );
    room.rows[0].status = "available";
    return room.rows[0];
  });
  await Promise.all(rooms).then(value => {
    if (value.length) {
      data = [...data, ...value];
    }
  });

  return res.status(200).json({
    status: 200,
    data
  });
};

export const booking = (req, res) => {
  const decoded = jwt.decode(req.headers.token, { complete: true });
  const { id: room_id } = req.params;
  const { checkInDate, checkOutDate } = req.body;
  pool.query(
    "INSERT INTO bookings (room_id, checkout_date, checkin_date) VALUES ($1, $2, $3) RETURNING *",
    [parseInt(room_id), checkInDate, checkOutDate],
    (error, results) => {
      if (error) {
        throw error;
      }
      const { id, room_id, checkout_date, checkin_date } = results.rows[0];
      const data = {
        id,
        room_id,
        checkout_date,
        checkin_date
      };
      pool.query(
        "UPDATE rooms SET status=$1 WHERE id=$2",
        ["unavailable", parseInt(room_id)],
        (error, results) => {
          pool.query(
            "SELECT id FROM users WHERE is_admin = $1",
            [true],
            (error, admin) => {
              admin.rows.map(res => {
                Helper.adminNotifacation(
                  req,
                  decoded.payload.email,
                  res.id,
                  room_id
                );
              });
              return res.status(201).json({
                status: 201,
                data
              });
            }
          );
        }
      );
    }
  );
};

export const viewBookings = async (req, res) => {
  const { id } = req.params;
  let messageCount;
  const results = await pool.query("SELECT * FROM bookings");
  messageCount = results.rows.length;

  const notify = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Hostel Booking</title>
          <script src="/socket.io/socket.io.js"></script>
        </head>
        <body>
          <h1>Hostel Bookings</h1>
          <h2 id="messageCount"></h2>
          <div id="message-container">
          </div>
          <script>
            const socket = io();
            let countMessage = ${messageCount};
            const messageCount = messageCount => {
              const message = document.getElementById('messageCount');
              message.textContent = 'Bookings:' + messageCount;
            };
            const messageDisplay = (message) => {
              const div = document.getElementById('message-container');
              let paragraph = document.createElement('p');
              paragraph.appendChild(document.createTextNode(message));
              div.appendChild(paragraph);
            };
            messageCount(${messageCount});
            socket.on('${id}', data => {
              messageDisplay(data)
              countMessage += 1;
              messageCount(countMessage);
            });
          </script>
        </body>
      </html>
    `;
  res.send(notify);
};
