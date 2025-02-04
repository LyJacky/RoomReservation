const express = require('express');
const cors = require('cors');

const mongo = require('./config/mongo');

const app = express();

const PORT = 8080;

// options object to expose header to the client
const options = { exposedHeaders: ['Authorization'] };

// middleware to enable cors
app.use(cors(options));

// middleware to parse POST/PUT bodies in express
app.use(express.json());

// require in our resource routes
const reservation = require('./api/reservations/reservation.routes.js');
const room = require('./api/rooms/room.routes.js');

// mount the resource routes to our express app
app.use('/reservation', reservation);
app.use('/room', room);

// start the express server and connect to mongo
app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await mongo.connectDB();
});
