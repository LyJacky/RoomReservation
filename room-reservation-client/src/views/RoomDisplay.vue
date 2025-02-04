<template>
  <div class="container mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl md:text-3xl font-bold mb-8 text-gray-800 tracking-tight">Room Management</h1>
      <button @click="openCreateModal"
        class="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition-colors duration-300">
        <span class="text-xl mr-1">+</span> Add Room
      </button>
    </div>

    <!-- Room Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="room in rooms" :key="room._id" class="border p-4 rounded-lg shadow-md relative">
        <!-- Room Details -->
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

    <!-- Modal -->
    <ModalPopUp :isOpen="isModalOpen" :room="editableRoom" @update:room="updateRoom" @create:room="createRoom"
      :isEdit="isEditing" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { cloneDeep } from 'lodash';
import ModalPopUp from '../components/ModalPopUp.vue';
import EllipsisButton from '../components/EllipsisButton.vue';
import { useToast } from 'vue-toastification';
import { useRoomStore } from '@/stores/roomStore';
import { useReservationStore } from '@/stores/ReservationStore';

const reservationStore = useReservationStore()
const roomStore = useRoomStore();
const rooms = computed(() => roomStore.rooms);

const toast = useToast();
const isModalOpen = ref(false);
const editableRoom = ref({
  _id: null,
  name: '',
  description: '',
  capacity: 1,
  equipments: [],
});
const isEditing = ref(false);

const openEditModal = (room) => {
  isEditing.value = true;
  editableRoom.value = cloneDeep(room);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editableRoom.value = {
    _id: null,
    name: '',
    description: '',
    capacity: 1,
    equipments: [],
  };
};

const updateRoom = async (updatedRoom) => {
  try {
    // Use the store's method to update
    await roomStore.editRoom(updatedRoom._id, updatedRoom);
    toast.success('Room updated successfully!');
    closeModal();
  } catch (err) {
    if (err.response && err.response.status === 500) {
      toast.error(`There already exists a room with the name ${updatedRoom.name}. Please pick another name for that room.`);
    } else {
      console.log(err)
      toast.error('An unexpected error occurred.');
    }
  }
};

const createRoom = async (newRoom) => {
  try {
    await roomStore.addRoom(newRoom);
    toast.success('Room created successfully!');
    closeModal();
  } catch (storeError) {
    console.log("STORE ERROR:", storeError);

    // Check if it's a duplicate name error
    if (storeError.response && storeError.response.status === 500) {
      console.log("DUPLICATE NAME ERROR");
      toast.error(`There already exists a room with the name ${newRoom.name}. Please pick another name for that room.`);
    } else {
      console.log("OTHER ERROR");
      toast.error('An unexpected error occurred.');
    }
  }
};

const openCreateModal = () => {
  editableRoom.value = {
    _id: null,
    name: '',
    description: '',
    capacity: 1,
    equipments: [],
  };
  isEditing.value = false;
  isModalOpen.value = true;
};

const deleteRoom = async (roomId) => {
  try {
    await roomStore.removeRoom(roomId);
    await reservationStore.fetchAllReservations();
    toast.success('Room deleted successfully along with its corresponding reservations!');
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
</script>