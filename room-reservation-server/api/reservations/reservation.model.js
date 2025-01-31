const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
    {
        start_time: Date,
        end_time: Date,
        status: String,
        created_time: {
            type: Date,
            default: Date.now
        },
        room_id: { // This directly references a single Room document
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rooms' // Reference the 'Room' collection
        },
        created_by_name: String,
    },
);

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
