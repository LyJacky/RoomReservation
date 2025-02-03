<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Edit Room' : 'Create Room' }}</h2>
            <form @submit.prevent="submitForm">
                <!-- Form fields -->
                <div class="mb-4">
                    <label class="block font-medium mb-1">Room Name</label>
                    <input v-model="roomData.name" type="text" class="w-full border rounded px-3 py-2"
                        placeholder="Enter room name" />
                </div>
                <div class="mb-4">
                    <label class="block font-medium mb-1">Description</label>
                    <input v-model="roomData.description" type="text" class="w-full border rounded px-3 py-2"
                        placeholder="Enter description" />
                </div>
                <div class="mb-4">
                    <label class="block font-medium mb-1">Capacity</label>
                    <input v-model="roomData.capacity" type="number" class="w-full border rounded px-3 py-2" min="1"
                        placeholder="Enter capacity" />
                </div>
                <div>
                    <label class="block font-medium mb-1">Equipments</label>
                    <div class="space-y-2">
                        <div v-for="(eq, index) in roomData.equipments" :key="index" class="flex space-x-2">
                            <input v-model="roomData.equipments[index].name" type="text" class="w-full p-2 border rounded"
                                placeholder="Equipment name" />
                            <button type="button" @click="removeEquipment(index)"
                                class="bg-red-500 text-white px-3 rounded">-</button>
                        </div>
                    </div>
                    <button type="button" @click="addEquipment" class="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Add
                        Equipment</button>
                </div>
                <div class="flex justify-end">
                    <button type="button" @click="$emit('close')"
                        class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">Cancel</button>
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{{ isEdit ?
                        'Save Changes' : 'Create Room' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    room: Object,
    isEdit: Boolean,
});

const emit = defineEmits(['update:room', 'create:room', 'close']);

// Initialize roomData with default values
const roomData = ref({
    _id: '',
    name: '',
    description: '',
    capacity: 1,
    equipments: [],
    ...props.room, // Override with props.room if provided
});

// Watch for changes in props.room and update roomData
watch(() => props.room, (newRoom) => {
    roomData.value = {
        _id: newRoom._id || '',
        name: newRoom.name || '',
        description: newRoom.description || '',
        capacity: newRoom.capacity || 1,
        equipments: newRoom.equipments ? [...newRoom.equipments] : [],
    };
}, { immediate: true });

const submitForm = () => {
    if (props.isEdit) {
        emit('update:room', { ...roomData.value });
    } else {
        emit('create:room', { ...roomData.value });
    }
};

const removeEquipment = (index) => {
    roomData.value.equipments.splice(index, 1);
};

const addEquipment = () => {
    roomData.value.equipments.push({ name: '' });
};
</script>