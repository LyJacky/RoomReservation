<template>
  <div class="container mx-auto p-6">
    <div class="max-w-lg mx-auto">
      <h2 class="text-xl font-bold mb-4">Create Room</h2>
      <form @submit.prevent="createRoom" class="space-y-4">
        <div>
          <label class="block mb-2">Name</label>
          <input v-model="newRoom.name" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div>
          <label class="block mb-2">Description</label>
          <input v-model="newRoom.description" type="text" class="w-full p-2 border rounded" required />
        </div>
        <div>
          <label class="block mb-2">Capacity</label>
          <input v-model.number="newRoom.capacity" type="number" min="1" class="w-full p-2 border rounded" required />
        </div>
        <div>
          <label class="block mb-2">Equipments</label>
          <div class="space-y-2">
            <div v-for="(eq, index) in newRoom.equipments" :key="index" class="flex space-x-2">
              <input v-model="newRoom.equipments[index].name" type="text" class="w-full p-2 border rounded"
                placeholder="Equipment name" />
              <button type="button" @click="removeEquipment(index)" class="bg-red-500 text-white px-3 rounded">
                -
              </button>
            </div>
          </div>
          <button type="button" @click="addEquipment" class="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
            Add Equipment
          </button>
        </div>
        <div class="flex space-x-4">
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">
            Create
          </button>
          <router-link to="/room" class="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const newRoom = ref({
  name: '',
  description: '',
  capacity: 1,
  equipments: [{ name: '' }]
});

const createRoom = async () => {
  try {
    console.log(newRoom.value);
    await axios.post('http://localhost:8080/room', {
      name: newRoom.value.name,
      description: newRoom.value.description,
      capacity: newRoom.value.capacity,
      equipments: newRoom.value.equipments,
    });
    router.push('/room');
  } catch (error) {
    console.error('Reservation failed:', error);
  }
};

const addEquipment = () => {
  newRoom.value.equipments.push({ name: '' });
};

const removeEquipment = (index) => {
  newRoom.value.equipments.splice(index, 1);
};
</script>
