<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl md:text-3xl font-bold mb-8  text-gray-800 tracking-tight">
      My Reservations
    </h1>

    <div v-if="reservations.length === 0" class="text-center text-gray-500 py-8">
      No upcoming reservations
    </div>

    <div v-else class="space-y-4">
      <div v-for="reservation in sortedReservations" :key="reservation.id"
        class="border rounded-lg p-4 flex justify-between items-center bg-white shadow">
        <div>
          <h3 class="font-bold">Reserved by: {{ reservation.created_by_name }}</h3>
          <h3 class="font-bold">Room Name: {{ reservation.room_id?.name }}</h3>
          <p class="text-gray-600">
            {{ formatDate(reservation.start_time) }} at {{ formatTime(reservation.start_time) }}
            - {{ formatDate(reservation.end_time) }} at {{ formatTime(reservation.end_time) }}
          </p>
          <p>Duration: {{ reservation.duration }} minutes</p>
        </div>

        <button @click="cancelReservation(reservation._id)"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const reservations = ref([]);

const sortedReservations = computed(() => {
  return [...reservations.value].sort((a, b) => {
    const dateA = new Date(a.start_time);
    const dateB = new Date(b.start_time);
    return dateA - dateB;
  });
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const cancelReservation = async (id) => {
  try {
    console.log(id)
    const reservationsResponse = await axios.put('http://localhost:8080/reservation/cancelReservation', {
      id: id,
    });
    await fetchReservations();
    // console.log(reservations.value);
  } catch (err) {
    console.error('Failed to load reservations:', err);
  }
  // reservations.value = reservations.value.filter((res) => res._id !== id);
};

const fetchReservations = async () => {
  try {
    const reservationsResponse = await axios.get('http://localhost:8080/reservation');

    // Map data to include formatted reservation details and duration
    reservations.value = reservationsResponse.data.map((res) => {
      const startTime = new Date(res.start_time);
      const endTime = new Date(res.end_time);
      const duration = Math.round((endTime - startTime) / 60000); // Duration in minutes

      return {
        ...res,
        duration,
      };
    });

    console.log(reservations.value);
  } catch (err) {
    console.error('Failed to load reservations:', err);
  }
};

onMounted(fetchReservations);
</script>
  