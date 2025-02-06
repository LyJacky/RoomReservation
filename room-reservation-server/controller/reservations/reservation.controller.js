const { ReservationType } = require('../../model/reservation.model')
const ReservationService = require('../../service/reservation.service')

const getReservations = async (req, res) => {
    try {
        // Find reservations and populate the room_id field
        const reservations = await ReservationService.findReservations(ReservationType.active.description);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


const getNonValidRooms = async (req, res) => {
    const { query } = req;
    const start_time = query.start_time ? new Date(query.start_time) : null;
    const end_time = query.end_time ? new Date(query.end_time) : null;

    try {
        // Find reservations that match the filter and populate the room_id field
        const uniqueRooms = await ReservationService.findNonValidRooms(
            ReservationType.active.description,
            {
                start: start_time,
                end: end_time
            }
        );

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
        const reservation = await ReservationService.bookReservation(body)
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};
const cancelReservation = async (req, res) => {
    const { body } = req;
    const id = body.id;
    // use the ID and then put the status to cancelled
    try {
        const reservation = await ReservationService.cancelReservation(id);
        if (reservation) {
            res.json(reservation);
        } else {
            res.status(404).json({ error: `No Reservation found by id: ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


module.exports = {
    getReservations,
    createReservation,
    getNonValidRooms,
    cancelReservation
};
