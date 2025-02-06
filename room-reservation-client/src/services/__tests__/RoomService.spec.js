import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getRooms, createRoom, updateRoom, deleteRoomById } from '../RoomServices'; // Adjust path as needed
import config from '../../config.json';

const API_BASE_URL = config.API_BASE_URL;

describe('RoomService API Functions', () => {
    let mockAxios;

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    describe('getRooms', () => {
        it('should fetch all rooms successfully', async () => {
            const mockData = [
                { id: 1, name: 'Room 1' },
                { id: 2, name: 'Room 2' },
            ];

            mockAxios.onGet(`${API_BASE_URL}/room`).reply(200, mockData);

            const result = await getRooms();
            expect(result).toEqual(mockData);
        });

        it('should throw an error when the fetch fails', async () => {
            mockAxios.onGet(`${API_BASE_URL}/room`).reply(500);

            await expect(getRooms()).rejects.toThrow('Request failed with status code 500');
        });
    });

    describe('createRoom', () => {
        it('should create a room successfully', async () => {
            const mockData = { id: 1, name: 'New Room' };
            const reservationData = { name: 'New Room' };

            mockAxios.onPost(`${API_BASE_URL}/room`).reply(200, mockData);

            const result = await createRoom(reservationData);
            expect(result).toEqual(mockData);
        });

        it('should throw an error when creating a room fails', async () => {
            const reservationData = { name: 'New Room' };

            mockAxios.onPost(`${API_BASE_URL}/room`).reply(500);

            await expect(createRoom(reservationData)).rejects.toThrow('Request failed with status code 500');
        });
    });

    describe('updateRoom', () => {
        it('should cancel a reservation successfully', async () => {
            const mockData = { message: 'Reservation cancelled' };
            const roomId = 1;

            mockAxios.onPut(`${API_BASE_URL}/room/${roomId}`).reply(200, mockData);

            const result = await updateRoom(roomId, mockData);
            expect(result.data).toEqual(mockData);
        });

        it('should throw an error when cancelling fails', async () => {
            const roomId = 1;
            const mockData = { message: 'Reservation cancelled' };

            mockAxios.onPut(`${API_BASE_URL}/room/${roomId}`).reply(500);

            await expect(updateRoom(roomId, mockData)).rejects.toThrow('Request failed with status code 500');
        });
    });
});
