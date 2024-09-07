# Booking Server

This project is a simple backend application for managing booking slots. It is built using Node.js and Express, and it allows users to view available slots and make bookings.

## Features

- View all slots for a given date.
- View all available time slots for a date.
- Book a time slot.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/houdahmz/laser-game-booking.git

2. Navigate to the project directory:

   ```bash
   cd laser-game-booking/backend
3. Install the dependencies:

   ```bash
   npm install 

4. Running the Server:
   ```bash
   node index.js

5. API Endpoints
Get All Slots for a Date
URL: /slots

Method: GET

Query Parameters:

date (required): The date for which you want to view slots (e.g., 2024-09-07).
Response: An array of all slots for the specified date.

Example:

bash
Copy code
curl http://localhost:5000/slots?date=2024-09-07
Get Available Slots for a Date
URL: /slots/available

Method: GET

Query Parameters:

date (required): The date for which you want to view available slots (e.g., 2024-09-07).
Response: An array of available slots (not booked) for the specified date.

Example:

bash
Copy code
curl http://localhost:5000/slots/available?date=2024-09-07
Book a Slot
URL: /book

Method: POST

Body:

date (required): The date of the slot to be booked.
time (required): The time of the slot to be booked.
name (required): The name of the person booking the slot.
Response: Success message if booking is successful, or an error message if the slot is already booked.

Example:

bash
Copy code
curl -X POST http://localhost:5000/book \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-09-07", "time": "10:00 AM", "name": "John Doe"}'

  