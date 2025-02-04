import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as roomService from '../services/RoomServices';

export const useRoomStore = defineStore('room', () => {
    const rooms = ref([]);

    const fetchRooms = async (capacity = null) => {
        try {
            rooms.value = await roomService.getRooms(capacity);
        } catch (error) {
            throw error;
        }
    };

    const addRoom = async (roomData) => {
        try {
            const createdRoom = await roomService.createRoom(roomData);
            await fetchRooms();
            return createdRoom;
        } catch (error) {
            throw error;
        }
    };

    // In roomStore.js
    const editRoom = async (roomId, roomData) => {
        try {
            const response = await roomService.updateRoom(roomId, roomData);
            await fetchRooms();
            return response.data; // Return the updated room
        } catch (error) {
            throw error;
        }
    };

    const removeRoom = async (roomId) => {
        try {
            await roomService.deleteRoom(roomId);
            await fetchRooms(); // Refresh rooms after deleting
        } catch (error) {
            throw error;
        }
    };
    // Getter for rooms with capacity greater than or equal to the specified capacity
    const getRoomsWithCapacity = computed(() => (capacity) => {
        return rooms.value.filter(room => room.capacity >= capacity);
    });
    return {
        rooms,
        fetchRooms,
        addRoom,
        editRoom,
        removeRoom,
        getRoomsWithCapacity
    };
}, {
    persist: {
        // Customize persistence if needed
        key: 'room-store', // unique key for localStorage
        storage: localStorage, // or sessionStorage
        paths: ['rooms'], // only persist rooms array
    }
});