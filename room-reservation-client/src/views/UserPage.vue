<template>
  <div class="container mx-auto p-6">
    <!-- Header with Page Indicator -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
        My Reservations
      </h1>
      <div v-if="allReservations.length > pageSize" class="flex items-center space-x-2">
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

    <!-- No Reservations Message -->
    <div v-if="allReservations.length === 0 && !isLoading" class="text-center text-gray-500 py-8">
      No upcoming reservations
    </div>

    <!-- Reservations List -->
    <div v-else class="space-y-4">
      <ReservationInfo v-for="reservation in visibleReservations" :key="reservation.id" :reservation="reservation"
        @cancel="cancelReservation" />
    </div>

    <!-- Pagination Controls -->
    <div v-if="allReservations.length > pageSize" class="flex justify-center items-center mt-8 space-x-4">
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
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import ReservationInfo from '../components/ReservationInfo.vue';

const router = useRouter();
const route = useRoute();

const allReservations = ref([]); // Holds all reservations fetched from the server
const isLoading = ref(false);
const pageSize = 10; // Number of reservations per page
const currentPage = ref(1); // Current page number

// Fetch all reservations from the server
const fetchReservations = async () => {
  isLoading.value = true;

  try {
    const response = await axios.get('http://localhost:8080/reservation');
    // Sort reservations by start date (earliest first)
    const sortedReservations = response.data.sort((a, b) => {
      return new Date(a.start_time) - new Date(b.start_time);
    });

    allReservations.value = sortedReservations.map((res) => {
      const startTime = new Date(res.start_time);
      const endTime = new Date(res.end_time);
      const duration = Math.round((endTime - startTime) / 60000); // Duration in minutes

      return {
        ...res,
        duration,
      };
    });
    console.log(allReservations.value)
  } catch (err) {
    console.error('Failed to load reservations:', err);
  } finally {
    isLoading.value = false;
  }
};

// Computed property to get the reservations for the current page
const visibleReservations = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return allReservations.value.slice(startIndex, endIndex);
});

// Computed property to calculate the total number of pages
const totalPages = computed(() => {
  return Math.ceil(allReservations.value.length / pageSize);
});

// Go to the next page
const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
    updateUrl();
  }
};

// Go to the previous page
const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    updateUrl();
  }
};

// Update the URL with the current page (without trailing slash)
const updateUrl = () => {
  router.push({ path: '/', query: { page: currentPage.value } });
};

// Cancel a reservation
const cancelReservation = async (id) => {
  try {
    await axios.put('http://localhost:8080/reservation/cancelReservation', {
      id: id,
    });
    allReservations.value = allReservations.value.filter((res) => res._id !== id);
  } catch (err) {
    console.error('Failed to cancel reservation:', err);
  }
};

// Watch for changes in the URL's `page` parameter
watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = parseInt(newPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages.value) {
      currentPage.value = pageNumber;
    }
  }
);

// Initialize the page from the URL
onMounted(() => {
  const initialPage = parseInt(route.query.page, 10);
  if (!isNaN(initialPage) && initialPage >= 1) {
    currentPage.value = initialPage;
  }
  fetchReservations();
});
</script>
