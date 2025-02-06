const ReservationService = require('../reservation.service');
const ReservationRepository = require('../../repository/reservation.repository');

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
                { id: 1, status: 'active' },
                { id: 2, status: 'active' }
            ];
            ReservationRepository.search.mockResolvedValue(mockReservations);

            const reservations = await reservationService.findReservations('active');

            expect(reservations).toEqual(mockReservations);
            expect(ReservationRepository.search).toHaveBeenCalledWith('active', null);
        });

        it('should throw an error if ReservationRepository.search throws an error', async () => {
            const errorMessage = 'Database error';
            ReservationRepository.search.mockRejectedValue(new Error(errorMessage));

            await expect(reservationService.findReservations('active')).rejects.toThrow(errorMessage);
        });
    });

    describe('findNonValidRooms', () => {
        it('should return unique rooms for a given status and date range', async () => {
            const mockReservations = [
                { room_id: { _id: '1', name: 'Room 1' }, status: 'active' },
                { room_id: { _id: '2', name: 'Room 2' }, status: 'active' },
                { room_id: { _id: '1', name: 'Room 1' }, status: 'active' }
            ];
            const mockDateRange = { start: '2025-02-01', end: '2025-02-07' };
            ReservationRepository.search.mockResolvedValue(mockReservations);

            const uniqueRooms = await reservationService.findNonValidRooms('active', mockDateRange);

            expect(uniqueRooms).toEqual([{ _id: '1', name: 'Room 1' }, { _id: '2', name: 'Room 2' }]);
            expect(ReservationRepository.search).toHaveBeenCalledWith('active', mockDateRange);
        });

        it('should throw an error if ReservationRepository.search throws an error', async () => {
            const errorMessage = 'Database error';
            ReservationRepository.search.mockRejectedValue(new Error(errorMessage));

            await expect(reservationService.findNonValidRooms('active', {})).rejects.toThrow(errorMessage);
        });
    });
    describe('bookReservation', () => {
        it('should return reservations for a given status', async () => {
            const mockReservation = { room_id: 1, _id: 1, start_time: '2025-02-01', end_time: '2025-02-07' }
            const mockData = { room_id: 1, _id: 1, start_time: '2025-02-01', end_time: '2025-02-07' }

            ReservationRepository.createReservation.mockResolvedValue(mockReservation);
            const reservation = await reservationService.bookReservation(mockData);
            expect(reservation).toEqual(mockReservation);
            expect(ReservationRepository.createReservation).toHaveBeenCalledWith(mockData);
        });

        it('should throw an error if ReservationRepository.search throws an error', async () => {
            const mockReservaiton = { room_id: 1, _id: 1 }
            const errorMessage = ' Error: Missing information for room reservation';
            await expect(reservationService.bookReservation(mockReservaiton)).rejects.toThrow(errorMessage);
        });
    });
});
