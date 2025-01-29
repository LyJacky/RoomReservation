<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Room Management</h1>
      <router-link 
        to="/create-room" 
        class="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600 transition-colors duration-300"
      >
        <span class="text-xl mr-1">+</span> Add Room
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="room in rooms" 
        :key="room.id" 
        class="border p-4 rounded shadow relative"
      >
        <h3 class="font-bold text-lg mt-4">Room Name: {{ room.name }}</h3>
        <p class="text-gray-600">{{ room.description }}</p>
        <p>Capacity: {{ room.capacity }}</p>
        <div class="mt-2">
          <span class="font-semibold">Equipment</span>
          <ul class="list-disc ml-4">
            <li v-for="(eq, index) in room.equipments" :key="index">
              {{ eq.name }}
            </li>
          </ul>
        </div>
        <button 
          @click="openEditModal(room)" 
          class="mt-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Edit
        </button>
        <button 
          @click="deleteRoom(room.id)" 
          class="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div 
  v-if="isModalOpen" 
  class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
>
  <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
    <h2 class="text-xl font-bold mb-4">Edit Room</h2>
    <form @submit.prevent="submitEdit">
      <div class="mb-4">
        <label class="block font-medium mb-1">Room Name</label>
        <input 
          v-model="editableRoom.name" 
          type="text" 
          class="w-full border rounded px-3 py-2"
          placeholder="Enter room name"
        />
      </div>
      <div class="mb-4">
        <label class="block font-medium mb-1">Description</label>
        <input 
          v-model="editableRoom.description" 
          type="text" 
          class="w-full border rounded px-3 py-2"
          placeholder="Enter description"
        />
      </div>
      <div class="mb-4">
        <label class="block font-medium mb-1">Capacity</label>
        <input 
          v-model="editableRoom.capacity" 
          type="number" 
          class="w-full border rounded px-3 py-2"
          placeholder="Enter capacity"
        />
      </div>
      <div class="flex justify-end">
        <button 
          type="button" 
          @click="closeEditModal" 
          class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const rooms = ref([]);

const isModalOpen = ref(false);
const editableRoom = ref({
  id: null,
  name: '',
  description: '',
  capacity: null,
});

const openEditModal = (room) => {
  editableRoom.value = { ...room }; // Clone the room details
  isModalOpen.value = true;
};

const closeEditModal = () => {
  isModalOpen.value = false;
  editableRoom.value = { id: null, name: '', description: '', capacity: null };
};

const submitEdit = () => {
  // Placeholder function for API call
  console.log('Edited Room:', editableRoom.value);
  // Close modal
  closeEditModal();
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
