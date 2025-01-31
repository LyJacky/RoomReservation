<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Room Management</h1>
      <router-link
        to="/create-room"
        class="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition-colors duration-300"
      >
        <span class="text-xl mr-1">+</span> Add Room
      </router-link>
    </div>

    <!-- Room Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="room in rooms"
        :key="room._id"
        class="border p-4 rounded-lg shadow-md relative"
      >
        <!-- Room Details -->
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-lg">Room Name: {{ room.name }}</h3>
          <EllipsisButton
            @option-selected="handleEllipsisOption(room, $event)"
            class="text-gray-500"
          />
        </div>
        <p class="text-gray-600">{{ room.description }}</p>
        <p class="text-gray-500 text-sm">
          <i class="fa fa-users"></i> <span class="ml-.5">{{ room.capacity }}</span>
        </p>
        <div v-if="room.equipments && room.equipments.length > 0">
          <span class="text-gray-700 font-medium text-sm"> Equipments : </span>
          <span class="text-gray-600 text-sm">
            {{ room.equipments.map(equipment => equipment.name).join(', ') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalPopUp
      :isOpen="isModalOpen"
      :room="editableRoom"
      @update:room="updateRoom"
      @close="closeEditModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import ModalPopUp from '../components/ModalPopUp.vue';
import EllipsisButton from '../components/EllipsisButton.vue';

const rooms = ref([]);

const isModalOpen = ref(false);
const editableRoom = ref({
  _id: null,
  name: '',
  description: '',
  capacity: null,
  equipments: [],
});

const openEditModal = (room) => {
  editableRoom.value = cloneDeep(room); // Deep copy the room object
  isModalOpen.value = true;
};

const closeEditModal = () => {
  isModalOpen.value = false;
  editableRoom.value = {
    _id: null,
    name: '',
    description: '',
    capacity: null,
    equipments: [],
  };
};

const updateRoom = async (updatedRoom) => {
  try {
    const roomId = updatedRoom._id;
    await axios.put(`http://localhost:8080/room/${roomId}`, updatedRoom);
    fetchRooms();
    closeEditModal();
  } catch (err) {
    console.error('Failed to edit the room:', err);
    closeEditModal();
  }
};

const createRoom = async () => {
  try {
    console.log(editableRoom.value);
    await axios.post('http://localhost:8080/room', {
      name: editableRoom.value.name,
      description: editableRoom.value.description,
      capacity: editableRoom.value.capacity,
      equipments: editableRoom.value.equipments,
    });
    router.push('/room');
  } catch (error) {
    console.error('Reservation failed:', error);
  }
};
const deleteRoom = async (roomId) => {
  try {
    await axios.delete(`http://localhost:8080/room/${roomId}`);
    fetchRooms();
  } catch (err) {
    console.error('Failed to delete room:', err);
  }
};

const handleEllipsisOption = (room, option) => {
  if (option === 'edit') {
    openEditModal(room);
  } else if (option === 'delete') {
    deleteRoom(room._id); 
  }
};

const fetchRooms = async () => {
  try {
    const roomsResponse = await axios.get('http://localhost:8080/room');
    rooms.value = roomsResponse.data;
  } catch (err) {
    console.error('Failed to load rooms:', err);
  }
};

onMounted(fetchRooms);
</script>