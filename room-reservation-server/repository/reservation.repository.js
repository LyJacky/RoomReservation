const { Reservation, ReservationType } = require('../model/reservation.model');

class ReservationRepository {
    async search(status, dateRange) {
        let filter = {};

        if (status) {
            filter.status = status;
        } else {
            filter.status = ReservationType.active.description;
        }

        if (dateRange) {
            filter.$or = [
                { start_time: { $gte: dateRange.start, $lt: dateRange.end } }, // Starts in range
                { end_time: { $gt: dateRange.start, $lte: dateRange.end } }, // Ends in range
                { start_time: { $lte: dateRange.start }, end_time: { $gte: dateRange.end } } // Overlaps range
            ];
        }

        return await Reservation.find(filter).populate('room_id');
    }
    async findById(id) {
        return await Reservation.findById(id)
    }

    async deleteById(id) {
        return await Reservation.findOneAndDelete(id)
    }

    async update(id, data) {
        const reservation = await Reservation.findOneAndUpdate({ _id: id }, data, {
            new: true
        });
        return reservation;
    }
    async createReservation(data) {
        const reservationDoc = new Reservation(data);
        const reservation = await reservationDoc.save();
        return reservation;
    }
}

module.exports = new ReservationRepository();
