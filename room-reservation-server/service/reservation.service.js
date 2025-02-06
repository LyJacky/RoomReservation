const { ReservationType } = require('../model/reservation.model');
const ReservationRepository = require('../repository/reservation.repository');

class ReservationService {
    async findReservations(status) {
        try {
            const reservations = await ReservationRepository.search(status, null);
            return reservations
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async findNonValidRooms(status, dateRange) {
        try {
            const reservations = await ReservationRepository.search(status, dateRange);
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
            return uniqueRooms
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async bookReservation(reservationData) {
        try {
            if (!reservationData.room_id || !reservationData.start_time || !reservationData.end_time) {
                throw new Error(' Error: Missing information for room reservation');
            }
            const reservation = await ReservationRepository.createReservation(reservationData);
            return reservation
        } catch (err) {
            throw new Error(err.message);
        }

    }

    async cancelReservation(reservationId) {
        try {
            const reservation = await ReservationRepository.findById(reservationId);

            if (!reservation || reservation.status === ReservationType.cancelled.description) {
                throw new Error('Error: reservation not found or already canceled');
            }

            const updatedReservation = await ReservationRepository.update(reservationId, { status: ReservationType.cancelled.description });  // Added await
            return updatedReservation;
        } catch (err) {
            throw new Error(err.message);  // Ensure any caught error is properly thrown
        }
    }
}

module.exports = new ReservationService();

