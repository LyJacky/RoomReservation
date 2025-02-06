import axios from 'axios';
import config from '../config.json'
const API_BASE_URL = config.API_BASE_URL

export const getRooms = async (capacity) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/room`, {
            params: { capacity }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

export const createRoom = async (roomData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/room`, roomData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// RoomServices.js
export const updateRoom = async (roomId, roomData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/room/${roomId}`, roomData);
        return response; // Return full response
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
};

export const deleteRoomById = async (roomId) => {
    try {
        await axios.delete(`${API_BASE_URL}/room/${roomId}`);
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
};