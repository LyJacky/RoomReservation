import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchAllReservations, createReservation, cancelReservationById } from '../ReservationServices'; // Adjust path as needed
import config from '../../config.json';

const API_BASE_URL = config.API_BASE_URL;

describe('ReservationService API Functions', () => {
    let mockAxios;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe('fetchAllReservations', () => {
        it('should fetch all reservations successfully', async () => {
            const mockData = [
                { id: 1, name: 'Reservation 1' },
                { id: 2, name: 'Reservation 2' },
            ];

            mockAxios.onGet(`${API_BASE_URL}/reservation`).reply(200, mockData);

            const result = await fetchAllReservations();
            expect(result).toEqual(mockData);
        });

        it('should throw an error when the fetch fails', async () => {
            mockAxios.onGet(`${API_BASE_URL}/reservation`).reply(500);

            await expect(fetchAllReservations()).rejects.toThrow('Request failed with status code 500');
        });
    });

    describe('createReservation', () => {
        it('should create a reservation successfully', async () => {
            const mockData = { id: 1, name: 'New Reservation' };
            const reservationData = { name: 'New Reservation' };

            mockAxios.onPost(`${API_BASE_URL}/reservation`).reply(200, mockData);

            const result = await createReservation(reservationData);
            expect(result).toEqual(mockData);
        });

        it('should throw an error when creating a reservation fails', async () => {
            const reservationData = { name: 'New Reservation' };

            mockAxios.onPost(`${API_BASE_URL}/reservation`).reply(500);

            await expect(createReservation(reservationData)).rejects.toThrow('Request failed with status code 500');
        });
    });

    describe('cancelReservationById', () => {
        it('should cancel a reservation successfully', async () => {
            const mockData = { message: 'Reservation cancelled' };
            const id = 1;

            mockAxios.onPut(`${API_BASE_URL}/reservation/cancelReservation`).reply(200, mockData);

            const result = await cancelReservationById(id);
            expect(result).toEqual(mockData);
        });

        it('should throw an error when cancelling fails', async () => {
            const id = 1;

            mockAxios.onPut(`${API_BASE_URL}/reservation/cancelReservation`).reply(500);

            await expect(cancelReservationById(id)).rejects.toThrow('Request failed with status code 500');
        });
    });
});
