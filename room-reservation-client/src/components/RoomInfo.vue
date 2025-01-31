<template>
    <div class="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition">
      <div class="space-y-1">
        <!-- Display Room Name -->
        <h3 class="text-xl font-semibold text-gray-800">{{ room.name }}</h3>
  
        <!-- Display Room Description -->
        <p class="text-gray-500 text-sm">{{ room.description }}</p>
        

        <!-- Display Room Capacity -->
        
        <i class="text-gray-500 text-sm fa fa-users"></i> 
        <span class="text-gray-500 ml-0.5">{{ room.capacity }}</span>

        <i v-if="available" class="text-green-500 fa fa-check ml-2"> Available</i> 
        <i v-if="!available" class="text-red-500 fa fa-minus-circle ml-2"> Unavailable</i>
        
  
        <!-- Display Equipment List -->
        <div v-if="room.equipments && room.equipments.length > 0">
          <span class="text-gray-700 font-medium text-sm"> Equipments : </span>
          <span class="text-gray-600 text-sm">
            {{ room.equipments.map(equipment => equipment.name).join(', ') }}
          </span>
        </div>
      </div>
  
      <!-- Reserve Button -->
      <button  v-if=available
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
    available: true,
  });
  
  const emit = defineEmits(['reserve']);
  
  const handleReserve = () => {
    emit('reserve', props.room);
  };
  </script>
  