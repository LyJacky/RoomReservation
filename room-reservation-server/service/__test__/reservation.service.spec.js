// reservationService.test.js

const ReservationService = require('../reservation.service');
const ReservationRepository = require('../../repository/reservation.repository');

// Mock ReservationRepository methods
jest.mock('../../repository/reservation.repository');

describe('ReservationService', () => {
    let reservationService;

    beforeEach(() => {
        reservationService = ReservationService;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findReservations', () => {
        it('should return reservations for a given status', async () => {
            const mockReservations = [
                { id: 1, status: 'available' },
                { id: 2, status: 'available' }
            ];
            ReservationRepository.search.mockResolvedValue(mockReservations);

            const reservations = await reservationService.findReservations('available');

            expect(reservations).toEqual(mockReservations);
            expect(ReservationRepository.search).toHaveBeenCalledWith('available', null);
        });

        it('should throw an error if ReservationRepository.search throws an error', async () => {
            const errorMessage = 'Database error';
            ReservationRepository.search.mockRejectedValue(new Error(errorMessage));

            await expect(reservationService.findReservations('confirmed')).rejects.toThrow(errorMessage);
        });
    });

    describe('findNonValidRooms', () => {
        it('should return unique rooms for a given status and date range', async () => {
            const mockReservations = [
                { room_id: { _id: '1', name: 'Room 1' }, status: 'confirmed' },
                { room_id: { _id: '2', name: 'Room 2' }, status: 'confirmed' },
                { room_id: { _id: '1', name: 'Room 1' }, status: 'confirmed' }
            ];
            const mockDateRange = { start: '2025-02-01', end: '2025-02-07' };
            ReservationRepository.search.mockResolvedValue(mockReservations);

            const uniqueRooms = await reservationService.findNonValidRooms('confirmed', mockDateRange);

            expect(uniqueRooms).toEqual([{ _id: '1', name: 'Room 1' }, { _id: '2', name: 'Room 2' }]);
            expect(ReservationRepository.search).toHaveBeenCalledWith('confirmed', mockDateRange);
        });

        it('should throw an error if ReservationRepository.search throws an error', async () => {
            const errorMessage = 'Database error';
            ReservationRepository.search.mockRejectedValue(new Error(errorMessage));

            await expect(reservationService.findNonValidRooms('confirmed', {})).rejects.toThrow(errorMessage);
        });
    });
});
