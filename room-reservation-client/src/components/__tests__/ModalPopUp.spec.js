import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ModalPopUp from '../ModalPopUp.vue'

const factory = (props = {}) => {
    return mount(ModalPopUp, {
        props: {
            isOpen: true,
            room: {
                _id: null,
                name: '',
                description: '',
                capacity: 1,
                equipments: []
            },
            isEdit: false,
            ...props
        }
    });
};

describe('ModalPopUp.vue', () => {
    it('renders correctly when open', () => {
        const wrapper = factory();
        expect(wrapper.find('h2').text()).toBe('Create Room');
    });

    it('validates required fields', async () => {
        const wrapper = factory();
        await wrapper.find('form').trigger('submit.prevent');
        expect(wrapper.find('.text-red-500').exists()).toBe(true);
    });

    it('emits create event with correct data', async () => {
        const wrapper = factory();
        await wrapper.find('input[placeholder="Enter room name"]').setValue('Conference Room');
        await wrapper.find('input[placeholder="Enter description"]').setValue('A room for meetings');
        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.emitted('create:room')).toBeTruthy();
        expect(wrapper.emitted('create:room')[0][0]).toMatchObject({
            name: 'Conference Room',
            description: 'A room for meetings',
            capacity: 1,
            equipments: []
        });
    });

    it('adds and removes equipments', async () => {
        const wrapper = factory();
        const addButton = wrapper.findAll('button').find(btn => btn.text() === 'Add Equipment');
        await addButton.trigger('click');
        expect(wrapper.findAll('input[placeholder="Equipment name"]').length).toBe(1);

        const removeButton = wrapper.findAll('button').find(btn => btn.text() === '-');
        await removeButton.trigger('click');
        expect(wrapper.findAll('input[placeholder="Equipment name"]').length).toBe(0);
    });

    it('emits update event when editing', async () => {
        const wrapper = factory({ isEdit: true, room: { name: 'Old Room', description: 'Old Desc', capacity: 2, equipments: [] } });
        await wrapper.find('input[placeholder="Enter room name"]').setValue('Updated Room');
        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.emitted('update:room')).toBeTruthy();
        expect(wrapper.emitted('update:room')[0][0]).toMatchObject({ name: 'Updated Room' });
    });
});
