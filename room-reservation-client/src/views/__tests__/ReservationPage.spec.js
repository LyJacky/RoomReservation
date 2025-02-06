import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ReservationPage from '../ReservationPage.vue';
import { useDateSelectionStore } from '../../stores/DateSelectionStore';
import { getRooms } from '../../services/RoomService';
import { fetchNonValidRooms, createReservation } from '../../services/ReservationService';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia, createPinia } from 'pinia';
import { createApp } from 'vue';

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
            initialState: {
                dateSelectionStore: {
                    selectedDate: '2025-02-10',
                    startTime: '09:00',
                    endTime: '2025-02-10T10:00:00Z',
                    clearState: vi.fn(), // Mock the clearState method
                },
            },
        });
        const app = createApp({});
        app.use(pinia);
        setActivePinia(pinia);

        store = useDateSelectionStore();
        wrapper = mount(ReservationPage, {
            global: {
                plugins: [pinia],
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();  // Reset mocks after each test
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
        await wrapper.vm.$nextTick();  // Ensure async actions complete

        wrapper.vm.reserveRoom({ _id: '1', name: 'Room A' });
        expect(wrapper.vm.selectedRooms.length).toBe(1);
    });

    it('submits reservations successfully', async () => {
        // Set up the store state
        store.selectedDate = '2025-02-10';
        store.startTime = '09:00';
        store.endTime = '2025-02-10T10:00:00Z';

        // Set up selected rooms
        wrapper.vm.selectedRooms = [{ _id: '1', name: 'Room A' }];

        // Call the submitReservations method
        store.clearState = vi.fn(() => {
            store.selectedDate = '';
            store.startTime = '';
            store.endTime = '';
        });

        await wrapper.vm.submitReservations();

        // Assertions
        expect(createReservation).toHaveBeenCalledWith({
            room_id: '1',
            start_time: '2025-02-10T09:00:00.000Z',
            end_time: '2025-02-10T10:00:00.000Z',
            created_by_name: 'Jacky',
            status: 'active',
        });
    });
});
