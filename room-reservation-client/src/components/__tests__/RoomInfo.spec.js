import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import RoomInfo from '../RoomInfo.vue'; // Adjust the path to your component

const factory = (props = {}) => {
    return mount(RoomInfo, {
        props: {
            room: {
                _id: '1',
                name: 'Room 101',
                description: 'A beautiful room.',
                capacity: 4,
                equipments: [{ name: 'Projector' }]
            },
            available: true,
            selectedRooms: [],
            ...props
        }
    });
};

describe('RoomInfo.vue', () => {
    it('renders the room name correctly', () => {
        const wrapper = factory();
        const roomName = wrapper.find('h3.text-xl');
        expect(roomName.text()).toBe('Room 101');
    });

    it('displays available status when available is true', () => {
        const wrapper = factory();
        const availableText = wrapper.find('i.text-green-500');
        expect(availableText.exists()).toBe(true);
        expect(availableText.text()).toContain('Available');
    });
    it('displays available status when unavailable is false', () => {
        const wrapper = factory({ available: false });
        const unavailableText = wrapper.find('i.text-red-500');
        expect(unavailableText.exists()).toBe(true);
        expect(unavailableText.text()).toContain('Unavailable');
    });
});