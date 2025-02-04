import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as reservationService from '../services/ReservationServices'; // Adjust the import path as needed

export const useReservationStore = defineStore('reservation', () => {
    // State
    const reservations = ref([]);
    const error = ref(null);

    // Actions
    const fetchAllReservations = async () => {
        error.value = null;
        try {
            const data = await reservationService.fetchAllReservations();
            reservations.value = data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        } catch (err) {
            error.value = err.message || 'Failed to fetch reservations.';
            console.error('Error fetching reservations:', err);
        }
    };

    const cancelReservation = async (reservationId) => {
        error.value = null;
        try {
            await reservationService.cancelReservation(reservationId);
            await fetchAllReservations(); // Refresh the list after cancellation
        } catch (err) {
            error.value = err.message || 'Failed to cancel reservation.';
            console.error('Error canceling reservation:', err);
        }
    };

    const createReservation = async (reservationData) => {
        error.value = null;
        try {
            await reservationService.createReservation(reservationData);
            await fetchAllReservations(); // Refresh the list after creating a new reservation
        } catch (err) {
            error.value = err.message || 'Failed to create reservation.';
            console.error('Error creating reservation:', err);
        }
    };

    return {
        reservations,
        error,
        fetchAllReservations,
        cancelReservation,
        createReservation,
    };
}, {
    persist: {
        key: 'reservation-store', // Unique key for localStorage
        storage: localStorage, // Use localStorage for persistence
        paths: ['reservations'], // Only persist the reservations array
    },
});