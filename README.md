# Hostel Booking

## Project Overview

Hostel booking is an application that enables a registered user book rooms

## Features

---

### Users

- Signup
- Login
- View available room
- Book room

### Admin

- View Bookings
- create room

## Technologies Used

- [NodeJS](https://nodejs.org/en/download/)
- [ExpressJS](https://expressjs.com/)
- [PostgreSQL]

## Getting Started

---

### Installing/Run locally

- Make sure you have `nodejs`, `postgres` installed.
- Clone repo

  ```bash
    - git clone https://github.com/victor-shagor/hostel-booking.git
    - cd hostel-booking
    - npm install/yarn
    - Create/configure `.env` environment with the following credentials
      DATABASE_URL
      DATABASE_TEST
      SECRET
      password
      password1
    - Run `npm start/yarn start` to start the server
  ```

### Testing

- To test or consume the API locally, you can make use of [_Postman_](https://www.getpostman.com) to simulate a front-end client.
- You can also test by running `npm test`.

## HTTP Requests

All API requests are made by sending a secure HTTPS request using one of the following methods, depending on the action being taken:

- `POST` Create a data
- `GET` Get a data or data

### HTTP Response Codes

Each response will be returned with one of the following HTTP status codes:

- `200` `OK` The request was successful
- `201` `Created` The request was successfully created
- `400` `Bad Request` There was a problem with the request (security, malformed)
- `401` `Unauthorized` The supplied API credentials are invalid
- `403` `Forbidden` The credentials provided do not have permissions to access the requested resource
