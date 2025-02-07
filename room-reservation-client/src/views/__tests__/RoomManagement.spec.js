import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RoomManagement from '../RoomManagement.vue';
import ModalPopUp from '../../components/ModalPopUp.vue';
import EllipsisButton from '../../components/EllipsisButton.vue';
import { useToast } from 'vue-toastification';
import { getRooms, createRoom, updateRoom, deleteRoomById } from '../../services/RoomService';

vi.mock('../../services/RoomService', () => ({
    getRooms: vi.fn(),
    createRoom: vi.fn(),
    updateRoom: vi.fn(),
    deleteRoomById: vi.fn()
}));

vi.mock('vue-toastification');
useToast.mockReturnValue({
    success: vi.fn(),
    error: vi.fn()
});

describe('RoomManagement.vue', () => {
    let wrapper;
    beforeEach(async () => {
        getRooms.mockResolvedValue([
            { _id: '1', name: 'Room A', description: 'A conference room', capacity: 10, equipments: [] },
            { _id: '2', name: 'Room B', description: 'A meeting room', capacity: 5, equipments: [] }
        ]);

        wrapper = mount(RoomManagement, {
            global: {
                stubs: {
                    ModalPopUp,
                    EllipsisButton
                },
                plugins: [useToast]
            }
        });

    });
    afterEach(() => {
        vi.clearAllMocks();  // Clears all mock call counts
    });

    it('fetches and displays rooms', async () => {
        expect(getRooms).toHaveBeenCalled();
        expect(wrapper.findAll('div.border')).toHaveLength(2);
    });

    it('opens create room modal', async () => {
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.isModalOpen).toBe(true);
        expect(wrapper.vm.isEditing).toBe(false);
    });

    it('opens edit modal with correct room data', async () => {
        await wrapper.vm.openEditModal(wrapper.vm.rooms[0]);
        expect(wrapper.vm.isModalOpen).toBe(true);
        expect(wrapper.vm.isEditing).toBe(true);
        expect(wrapper.vm.editableRoom.name).toBe('Room A');
    });

    it('adds a room successfully', async () => {
        createRoom.mockResolvedValue();
        await wrapper.vm.addRoom({ name: 'Room C', description: 'New room', capacity: 8, equipments: [] });
        expect(createRoom).toHaveBeenCalled();
        expect(getRooms).toHaveBeenCalledTimes(2);
        expect(useToast().success).toHaveBeenCalledWith('Room created successfully!');

    });

    it('updates a room successfully', async () => {
        updateRoom.mockResolvedValue();
        await wrapper.vm.editRoom({ _id: '1', name: 'Room A Updated', description: 'Updated description', capacity: 12 });
        expect(updateRoom).toHaveBeenCalled();
        expect(getRooms).toHaveBeenCalledTimes(2);
        expect(useToast().success).toHaveBeenCalledWith('Room updated successfully!');

    });

    it('deletes a room successfully', async () => {
        deleteRoomById.mockResolvedValue();
        await wrapper.vm.deleteRoom('1');
        expect(deleteRoomById).toHaveBeenCalledWith('1');
        expect(getRooms).toHaveBeenCalledTimes(2);
        expect(useToast().success).toHaveBeenCalledWith('Room deleted successfully along with its corresponding reservations!');

    });
});
