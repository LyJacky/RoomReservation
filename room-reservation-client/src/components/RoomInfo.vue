<template>
  <div class="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition relative" :class="{
    'border-4': isSelected
  }">
    <div class="space-y-1">
      <!-- Display Room Name -->
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold text-gray-800">{{ room.name }}</h3>
        <i v-if="available" class="text-green-500 fa fa-check text-sm"> Available</i>
        <i v-if="!available" class="text-red-500 fa fa-minus-circle text-sm"> Unavailable</i>
      </div>

      <!-- Display Room Description -->
      <p class="text-gray-600 text-sm">{{ room.description }}</p>

      <!-- Display Room Capacity -->
      <i class="text-gray-600 text-sm fa fa-users"></i>
      <span class="text-gray-600 ml-0.5 text-sm">{{ room.capacity }}</span>

      <!-- Display Equipment List -->
      <div v-if="room.equipments && room.equipments.length > 0">
        <span class="text-gray-600 font-medium text-sm"> Equipments : </span>
        <span class="text-gray-600 text-sm">
          {{ room.equipments.map(equipment => equipment.name).join(', ') }}
        </span>
      </div>
    </div>

    <button v-if="available && !isSelected" @click="handleReserve"
      class="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition">
      Add Reservation
    </button>
    <button v-if="isSelected" @click="removeReservation"
      class="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition">
      <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
  available: Boolean,
  selectedRooms: Array
});

const emit = defineEmits(['reserve', 'remove']);

const isSelected = computed(() => props.selectedRooms.some(r => r._id === props.room._id));

const handleReserve = () => {
  emit('reserve', props.room);
};

const removeReservation = () => {
  emit('remove', props.room);
};
</script>
