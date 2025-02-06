import axios from 'axios';
import config from '../config.json'
const API_BASE_URL = config.API_BASE_URL


// Fetch non-valid reservations within a given time range
export const fetchNonValidRooms = async (startDateTime, endDateTime) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reservation/nonValidRooms`, {
            params: {
                start_time: startDateTime,
                end_time: endDateTime,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch non-valid reservations:', error);
        throw error;
    }
};

// Create a new reservation
export const createReservation = async (reservationData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reservation`, reservationData);
        return response.data;
    } catch (error) {
        console.error('Failed to create reservation:', error);
        throw error;
    }
};

// Fetch all reservations
export const fetchAllReservations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/reservation`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch reservations:', error);
        throw error;
    }
};

// Cancel a reservation
export const cancelReservationById = async (id) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/reservation/cancelReservation`, {
            id: id,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to cancel reservation:', error);
        throw error;
    }
};