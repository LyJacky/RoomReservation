<template>
    <div class="container mx-auto p-6">
      <div class="max-w-lg mx-auto">
        <h2 class="text-xl font-bold mb-4">Delete Room</h2>
        <div class="space-y-2">
          <div 
            v-for="room in rooms" 
            :key="room.id" 
            class="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <h3 class="font-semibold">{{ room.name }}</h3>
              <p class="text-sm text-gray-600">{{ room.description }}</p>
            </div>
            <button 
              @click="deleteRoom(room.id)" 
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
        <router-link 
          to="/" 
          class="mt-4 inline-block bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const rooms = ref([
    {
      id: 1,
      name: 'Salle #1',
      description: 'Conference Room',
      capacity: 10,
      equipments: ['Projector', 'Whiteboard']
    }
  ])
  
  const deleteRoom = (id) => {
    // Add API call here
    rooms.value = rooms.value.filter(room => room.id !== id)
  }
  </script>