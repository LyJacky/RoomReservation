import { mount } from '@vue/test-utils';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MyReservations from '../UserReservationDisplay.vue';
import { fetchAllReservations, cancelReservationById } from '../../services/ReservationService';
import { useToast } from 'vue-toastification';
import { createRouter, createWebHistory } from 'vue-router';

vi.mock('../../services/ReservationService');
vi.mock('vue-toastification');

const mockReservations = [
    {
        id: 1,
        start_time: '2024-02-01T10:00:00',
        end_time: '2024-02-01T11:00:00',
        name: 'Meeting 1'
    },
    {
        id: 2,
        start_time: '2024-02-02T10:00:00',
        end_time: '2024-02-02T11:00:00',
        name: 'Meeting 2'
    },
    {
        id: 3,
        start_time: '2024-02-03T10:00:00',
        end_time: '2024-02-03T11:00:00',
        name: 'Meeting 3'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: {} }]
});
useToast.mockReturnValue({
    success: vi.fn(),
    error: vi.fn()
});

describe('MyReservations', () => {
    let wrapper;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Setup mocks
        fetchAllReservations.mockResolvedValue(mockReservations);

        // Mount component
        wrapper = mount(MyReservations, {
            global: {
                plugins: [router],
                stubs: {
                    ReservationInfo: true
                }
            }
        });
    });

    it('fetches and displays reservations on mount', async () => {
        expect(fetchAllReservations).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.reservations.length).toBe(3);
    });

    it('paginates reservations correctly', async () => {

        expect(wrapper.vm.visibleReservations.length).toBe(3);
        expect(wrapper.vm.visibleReservations[0].id).toBe(1);
        expect(wrapper.vm.totalPages).toBe(1);

    });

    it('handles reservation cancellation correctly', async () => {
        cancelReservationById.mockResolvedValue();
        fetchAllReservations.mockResolvedValueOnce(mockReservations.slice(1)); // Return reservations without the canceled one
        await wrapper.vm.cancelReservation(mockReservations[0].id);

        expect(cancelReservationById).toHaveBeenCalledWith(mockReservations[0].id);
        expect(fetchAllReservations).toHaveBeenCalledTimes(2); // Once on mount, once after cancel
        expect(useToast().success).toHaveBeenCalledWith('Reservation successfully cancelled');
    });


    it('handles empty reservations list', async () => {
        fetchAllReservations.mockResolvedValueOnce([]);

        const emptyWrapper = mount(MyReservations, {
            global: {
                plugins: [router],
                stubs: {
                    ReservationInfo: true
                }
            }
        });

        expect(emptyWrapper.vm.reservations.length).toBe(0);
        expect(emptyWrapper.text()).toContain('No upcoming reservations');
    });
});