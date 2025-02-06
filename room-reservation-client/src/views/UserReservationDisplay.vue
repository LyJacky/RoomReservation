<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
        My Reservations
      </h1>
      <div v-if="reservations.length > pageSize" class="flex items-center space-x-2">
        <button @click="goToPreviousPage" :disabled="currentPage === 1"
          class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          &lt;
        </button>
        <span class="text-sm text-gray-600">
          {{ currentPage }} of {{ totalPages }}
        </span>
        <button @click="goToNextPage" :disabled="currentPage === totalPages"
          class="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          &gt;
        </button>
      </div>
    </div>

    <div v-if="reservations.length === 0" class="text-center text-gray-500 py-8">
      No upcoming reservations
    </div>

    <div v-else class="space-y-4">
      <ReservationInfo v-for="reservation in visibleReservations" :key="reservation.id" :reservation="reservation"
        @cancel="cancelReservation" />
    </div>

    <div v-if="reservations.length > pageSize" class="flex justify-center items-center mt-8 space-x-4">
      <button @click="goToPreviousPage" :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        Previous
      </button>
      <span class="text-gray-700">{{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ReservationInfo from '../components/ReservationInfo.vue';
import { useToast } from 'vue-toastification';
import { fetchAllReservations, cancelReservationById } from '../services/ReservationService';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const pageSize = 10;
const currentPage = ref(1);
const reservations = ref([]);

const visibleReservations = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return reservations.value.slice(startIndex, startIndex + pageSize);
});

const totalPages = computed(() => Math.ceil(reservations.value.length / pageSize));

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    updateUrl();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    updateUrl();
  }
};

const updateUrl = () => {
  router.push({ path: '/', query: { page: currentPage.value } });
};

const cancelReservation = async (id) => {
  await cancelReservationById(id);
  await fetchReservations();
  toast.success('Reservation successfully cancelled');
};

watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = parseInt(newPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages.value) {
      currentPage.value = pageNumber;
    }
  }
);

// Fetch reservations and process them (add duration, sort by start date)
const fetchReservations = async () => {
  const data = await fetchAllReservations();
  // Add duration and sort by start_date
  reservations.value = data.map(reservation => {
    const startTime = new Date(reservation.start_time);
    const endTime = new Date(reservation.end_time);
    const duration = Math.round((endTime - startTime) / (1000 * 60)); // Duration in minutes

    return {
      ...reservation,
      duration,
    };
  }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time)); // Sort by start_time
};

onMounted(fetchReservations);
</script>
