const Reservation = require('./reservation.model');

const getReservations = async (req, res) => {
    const { query } = req;

    let filter = {status:"active"};
    // Add query-based filtering logic here if needed

    try {
        // Find reservations and populate the room_id field
        const reservations = await Reservation.find(filter).populate('room_id');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


const getNonValidReservations = async (req, res) => {
    const { query } = req;
    const start_time = query.start_time ? new Date(query.start_time) : null;
    const end_time = query.end_time ? new Date(query.end_time) : null;

    // Ensure both start_time and end_time are provided
    if (!start_time || !end_time) {
        return res.status(400).json({ error: "start_time and end_time are required." });
    }
    console.log(start_time)
    console.log(end_time)

    const filter = {
        status: "active",
        $or: [
            // Reservation starts within the range
            { start_time: { $gte: start_time, $lte: end_time } },
            // Reservation ends within the range
            { end_time: { $gte: start_time, $lte: end_time } },
            // Reservation overlaps the range
            {
                start_time: { $lte: start_time },
                end_time: { $gte: end_time }
            }
        ]
    };

    try {
        // Find reservations that match the filter and populate the room_id field
        const reservations = await Reservation.find(filter).populate('room_id');
        console.log('THE RESERVAITONS OF THJIS ARE')
        console.log(reservations)
        // Extract unique rooms from the reservations
        const uniqueRooms = [];
        const roomSet = new Set();

        reservations.forEach((reservation) => {
            const roomId = reservation.room_id?._id.toString();
            if (roomId && !roomSet.has(roomId)) {
                roomSet.add(roomId);
                uniqueRooms.push(reservation.room_id); // Push the room details to the uniqueRooms array
            }
        });

        // Log and return the unique rooms
        console.log('Unique Rooms:', uniqueRooms);
        res.json(uniqueRooms);
    } catch (error) {
        console.error('Error fetching unique rooms:', error);
        res.status(500).json({ error: error.toString() });
    }
};



// for the req I need the room id , the time slots, when it was created ( now),
const createReservation = async (req, res) => {
    const { body } = req;

    try {
        // remove created and allow model to apply default
        delete body.created;

        const reservationDoc = new Reservation(body);
        const reservation = await reservationDoc.save();

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
const cancelReservation = async (req, res) => {
    console.log('I MADE IT INSIDE THE CANCEL 12321312');
    const { body } = req;
    
    const id = body.id;
    const status = {status: "cancelled"}
    console.log(body);
    // use the ID and then put the status to cancelled

    try {
        const reservation = await Reservation.findOneAndUpdate({ _id: id }, status, {
            new: true
        });

        if (reservation) {
            res.json(reservation);
        } else {
            res.status(404).json({ error: `No Reservation found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// const checkData = async () => {
//     try {
//         // Find all reservations and populate the room_id field
//         const reservations = await Reservation.find().populate('room_id');
//         console.log('Reservations:', reservations);
//     } catch (error) {
//         console.error('Error fetching reservations:', error);
//     }
// };
// checkData();

module.exports = {
    getReservations,
    createReservation,
    getNonValidReservations,
    cancelReservation
};
