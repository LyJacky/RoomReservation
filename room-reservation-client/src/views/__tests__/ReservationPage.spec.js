import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ReservationPage from '../ReservationPage.vue';
import { useDateSelectionStore } from '../../stores/DateSelectionStore';
import { getRooms } from '../../services/RoomService';
import { fetchNonValidRooms, createReservation } from '../../services/ReservationService';
import { createTestingPinia } from '@pinia/testing';
import { useToast } from 'vue-toastification';


vi.mock('vue-toastification');
useToast.mockReturnValue({
    success: vi.fn(),
    error: vi.fn()
});

// Mock dependencies
vi.mock('../../services/RoomService', () => ({
    getRooms: vi.fn(() =>
        Promise.resolve([
            { _id: '1', name: 'Room A' },
            { _id: '2', name: 'Room B' },
        ])
    ),
}));

vi.mock('../../services/ReservationService', () => ({
    fetchNonValidRooms: vi.fn(() => Promise.resolve([])),
    createReservation: vi.fn(() => Promise.resolve()),
}));



describe('ReservationPage.vue', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        const pinia = createTestingPinia({
            createSpy: vi.fn(),  // Create spies to track store actions
            stubActions: false,   // Ensure actions are not stubbed
        });

        store = useDateSelectionStore();
        wrapper = mount(ReservationPage, {
            global: {
                plugins: [pinia],
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component correctly', () => {
        expect(wrapper.find('h1').text()).toBe('Meeting Room Reservation');
    });

    it('updates selected date and start time', async () => {
        const dateInput = wrapper.find('input[type="date"]');
        await dateInput.setValue('2025-02-10');
        expect(store.selectedDate).toBe('2025-02-10');

        const timeInput = wrapper.find('input[type="time"]');
        await timeInput.setValue('09:00');
        expect(store.startTime).toBe('09:00');
    });


    it('searches available rooms', async () => {
        store.selectedDate = '2025-02-10';
        store.startTime = '09:00';
        store.endTime = new Date('2025-02-10T10:00:00Z').toISOString();

        await wrapper.vm.searchAvailableRooms();
        expect(getRooms).toHaveBeenCalled();
        expect(fetchNonValidRooms).toHaveBeenCalled();
    });

    it('reserves a room', async () => {
        store.selectedDate = '2025-02-10';
        store.startTime = '09:00';
        store.endTime = new Date('2025-02-10T10:00:00Z').toISOString();

        await wrapper.find('button').trigger('click');
        wrapper.vm.reserveRoom({ _id: '1', name: 'Room A' });
        expect(wrapper.vm.selectedRooms.length).toBe(1);

    });

    it('submits reservations successfully', async () => {
        store.selectedDate = '2025-02-10';
        store.startTime = '09:00';
        store.endTime = '2025-02-10T10:00:00Z';

        wrapper.vm.selectedRooms = [{ _id: '1', name: 'Room A' }];

        store.clearState = vi.fn(() => {
            store.selectedDate = '';
            store.startTime = '';
            store.endTime = '';
        });

        await wrapper.vm.submitReservations();

        expect(createReservation).toHaveBeenCalledWith({
            room_id: '1',
            start_time: '2025-02-10T09:00:00.000Z',
            end_time: '2025-02-10T10:00:00.000Z',
            created_by_name: 'Jacky',
            status: 'active',
        });
        expect(useToast().success).toHaveBeenCalledWith("Successfully reserved room: Room A");

    });
});
