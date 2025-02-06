<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold mb-8 text-gray-800 tracking-tight">Room Management</h1>
      <button @click="openCreateModal"
        class="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition-colors duration-300">
        <span class="text-xl mr-1">+</span> Add Room
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="room in rooms" :key="room._id" class="border p-4 rounded-lg shadow-md relative">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-lg">{{ room.name }}</h3>
          <EllipsisButton @option-selected="handleEllipsisOption(room, $event)" class="text-gray-500" />
        </div>
        <p class="text-gray-600 text-sm">{{ room.description }}</p>
        <p class="text-gray-600 text-sm"><i class="fa fa-users text-gray-600"></i> <span
            class="ml-.5 text-sm text-gray-600">{{ room.capacity }}</span></p>
        <div v-if="room.equipments && room.equipments.length > 0">
          <span class="text-gray-600 font-medium text-sm">Equipments:</span>
          <span class="text-gray-600 text-sm">{{ room.equipments.map(equipment => equipment.name).join(', ') }}</span>
        </div>
      </div>
    </div>

    <ModalPopUp :isOpen="isModalOpen" :room="editableRoom" @update:room="editRoom" @create:room="addRoom"
      :isEdit="isEditing" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { cloneDeep } from 'lodash';
import ModalPopUp from '../components/ModalPopUp.vue';
import EllipsisButton from '../components/EllipsisButton.vue';
import { useToast } from 'vue-toastification';
import { getRooms, createRoom, updateRoom, deleteRoomById } from '../services/RoomService';

const rooms = ref([]);
const toast = useToast();
const isModalOpen = ref(false);
const editableRoom = ref({ _id: null, name: '', description: '', capacity: 1, equipments: [] });
const isEditing = ref(false);

const fetchRooms = async () => {
  rooms.value = await getRooms();
};

const openEditModal = (room) => {
  isEditing.value = true;
  editableRoom.value = cloneDeep(room);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editableRoom.value = { _id: null, name: '', description: '', capacity: 1, equipments: [] };
};

const editRoom = async (updatedRoom) => {
  try {
    await updateRoom(updatedRoom._id, updatedRoom);
    await fetchRooms();
    toast.success('Room updated successfully!');
    closeModal();
  } catch (err) {
    handleRoomError(err, updatedRoom.name);
  }
};

const addRoom = async (newRoom) => {
  try {
    await createRoom(newRoom);
    await fetchRooms();
    toast.success('Room created successfully!');
    closeModal();
  } catch (err) {
    handleRoomError(err, newRoom.name);
  }
};

const deleteRoom = async (roomId) => {
  try {
    await deleteRoomById(roomId);
    await fetchRooms();
    toast.success('Room deleted successfully along with its corresponding reservations!');
  } catch (err) {
    console.error('Failed to delete room:', err);
  }
};

const handleEllipsisOption = (room, option) => {
  if (option === 'edit') openEditModal(room);
  else if (option === 'delete') deleteRoom(room._id);
};

const handleRoomError = (err, roomName) => {
  if (err.response && err.response.status === 500) {
    toast.error(`There already exists a room with the name ${roomName}. Please pick another name.`);
  } else {
    toast.error('An unexpected error occurred.');
  }
};

const openCreateModal = () => {
  editableRoom.value = { _id: null, name: '', description: '', capacity: 1, equipments: [] };
  isEditing.value = false;
  isModalOpen.value = true;
};

onMounted(fetchRooms);
</script>