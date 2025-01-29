<template>
    <div class="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
      <div class="space-y-1">
        <!-- Display Room Name -->
        <h3 class="text-xl font-semibold text-gray-800">{{ room.name }}</h3>
  
        <!-- Display Room Description -->
        <p class="text-gray-500 text-sm">{{ room.description }}</p>
  
        <!-- Display Room Capacity -->
        <p class="text-gray-500 text-sm">Capacity: {{ room.capacity }} people</p>
  
        <!-- Display Equipment List -->
        <div v-if="room.equipments && room.equipments.length > 0">
          <h4 class="text-gray-700 font-medium text-sm">Equipments:</h4>
          <ul class="list-disc pl-5 text-gray-600 text-sm">
            <li v-for="(equipment, index) in room.equipments" :key="index">
              {{ equipment.name }}  <!-- Assuming equipment object has a "name" property -->
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Reserve Button -->
      <button 
        @click="handleReserve" 
        class="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
      >
        Reserve
      </button>
    </div>
  </template>

  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    room: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['reserve']);
  
  const handleReserve = () => {
    emit('reserve', props.room);
  };
  </script>
  