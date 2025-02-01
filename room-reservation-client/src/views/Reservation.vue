<template>
  <div class="container mx-auto p-6 font-sans">
    <h1 class="text-2xl md:text-3xl font-bold mb-8 text-gray-800 tracking-tight">
      Meeting Room Reservation
    </h1>

    <div class="flex">
      <div class="max-w-4xl w-full" style="position: relative">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <!-- Date Picker -->
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">Select Date</label>
            <input type="date" v-model="selectedDate"
              class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              @input="exitDisplay" :min="new Date().toISOString().split('T')[0]" />
          </div>

          <!-- Start Time Selection -->
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">Start Time</label>
            <input type="time" v-model="startTime"
              class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              @input="exitDisplay" />
          </div>

          <!-- End Time Selection -->
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">End Time</label>
            <button @click.stop="showModal = !showModal" :disabled="!startTime || !selectedDate" :class="{
              'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300': !startTime || !selectedDate,
              'bg-white text-black': startTime && selectedDate
            }"
              class="w-full p-3 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-left">
              {{ endTime ? formatTime(new Date(endTime)) : 'Select End Time' }}
            </button>

            <!-- Modal for End Time Selection -->
            <div v-if="showModal" ref="modal"
              class="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
              :style="{ width: modalWidth, right: 0 }">
              <div class="p-3">
                <!-- Responsive Grid for End Time Options -->
                <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
                  <button v-for="time in endTimeOptions" :key="time.value" @click="selectEndTime(time.value)"
                    class="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 transition-all text-sm">
                    <div>{{ formatTime(new Date(time.value)) }}</div>
                    <div class="text-xs text-gray-500">{{ time.duration }}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Duration Display -->
    <div v-if="startTime && endTime" class="mt-4 text-lg text-gray-700">
      Duration: {{ duration }} minutes
    </div>

    <!-- Minimum Capacity and Search Button -->
    <div v-if="startTime && endTime && selectedDate" class="mt-4 flex items-end space-x-4">
      <!-- Minimum Capacity Input -->
      <div class="w-64"> <!-- Adjust width as needed -->
        <label class="block text-lg font-medium text-gray-700 mb-2">Minimum Capacity</label>
        <input type="number" v-model="minCapacity"
          class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          min="1" placeholder="Enter minimum capacity" />
      </div>

      <!-- Search Button -->
      <div>
        <button @click="searchAvailableRooms"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg transition-all transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Search Available Rooms
        </button>
      </div>
    </div>

    <!-- Available Rooms -->
    <div v-if="showAvailableRooms" class="mt-6">
      <div class="flex justify-between items-center border-b border-gray-200">
        <!-- Tabs (Available & Unavailable Rooms) -->
        <div class="flex space-x-4">
          <button @click="activeTab = 'available'"
            :class="['py-2 px-4 text-lg font-semibold', activeTab === 'available' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500']">
            Available Rooms ({{ availableRooms.length }})
          </button>
          <button @click="activeTab = 'unavailable'"
            :class="['py-2 px-4 text-lg font-semibold', activeTab === 'unavailable' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500']">
            Unavailable Rooms ({{ unavailableRooms.length }})
          </button>
        </div>
      </div>

      <!-- Available Rooms -->
      <div v-if="activeTab === 'available'" class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="room in availableRooms" :key="room.id">
            <RoomInfo :room="room" :available="true" @reserve="reserveRoom" class="mb-4" />
          </div>
        </div>
      </div>

      <!-- Unavailable Rooms -->
      <div v-if="activeTab === 'unavailable'" class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="room in unavailableRooms" :key="room.id">
            <RoomInfo :room="room" :false="false" class="mb-4" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import RoomInfo from '../components/RoomInfo.vue';

const selectedDate = ref(null);
const startTime = ref(null);
const endTime = ref(null);
const endTimeOptions = ref([]);
const showAvailableRooms = ref(false);
const availableRooms = ref([]);
const unavailableRooms = ref([]);
const activeTab = ref('available');
const showModal = ref(false);
const modal = ref(null);
const minCapacity = ref(null)

const duration = computed(() => {
  if (startTime.value && endTime.value && selectedDate.value) {
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}:00Z`);
    const endDateTime = new Date(endTime.value);

    if (endDateTime < startDateTime) {
      return 0;
    }

    return Math.max((endDateTime - startDateTime) / (1000 * 60), 0);
  }
  return 0;
});

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC', // Ensure the time is formatted in UTC
  });
};

const updateEndTimeOptions = () => {
  if (!startTime.value || !selectedDate.value) return;

  const start = new Date(`${selectedDate.value}T${startTime.value}:00Z`); // Ensure UTC
  endTimeOptions.value = [];
  endTime.value = null;

  // 300 minutes = 5 hours
  for (let i = 15; i <= 300; i += 15) {
    const newTime = new Date(start);
    newTime.setMinutes(newTime.getMinutes() + i);
    const duration = i < 60 ? `${i}m` : `${Math.floor(i / 60)}h ${i % 60}m`;
    endTimeOptions.value.push({
      value: newTime.toISOString(), // Ensure UTC
      label: formatTime(newTime), // Format in UTC
      duration: duration,
    });
  }
};

watch([startTime, selectedDate], updateEndTimeOptions);

const selectEndTime = (time) => {
  endTime.value = time;
  showModal.value = false;
  exitDisplay();
};

const searchAvailableRooms = async () => {
  try {
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}:00Z`).toISOString();
    const endDateTime = new Date(endTime.value).toISOString();

    const roomsResponse = await axios.get('http://localhost:8080/room', {
      params: {
        capacity: minCapacity.value
      }
    });
    const rooms = roomsResponse.data;

    const reservationsResponse = await axios.get('http://localhost:8080/reservation/nonValid', {
      params: {
        start_time: startDateTime,
        end_time: endDateTime,

      },
    });

    const reservations = reservationsResponse.data;
    const reservationIds = new Set(reservations.map(reservation => reservation._id.toString()));

    const updatedRooms = rooms.filter(room => !reservationIds.has(room._id.toString()));
    const updatedUnavailableRooms = rooms.filter(room => reservationIds.has(room._id.toString()));

    availableRooms.value = updatedRooms;
    showAvailableRooms.value = true;
    unavailableRooms.value = updatedUnavailableRooms;
  } catch (error) {
    console.error('Search failed:', error);
  }
};

const exitDisplay = () => {
  showAvailableRooms.value = false;
};

const reserveRoom = async (room) => {
  try {
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}:00Z`).toISOString();
    const endDateTime = new Date(endTime.value).toISOString();

    await axios.post('http://localhost:8080/reservation', {
      room_id: room._id,
      start_time: startDateTime,
      end_time: endDateTime,
      created_by_name: "Jacky",
      status: "active"
    });
    await searchAvailableRooms();
  } catch (error) {
    console.error('Reservation failed:', error);
  }
};

// Close modal when clicking outside
const handleClickOutside = (event) => {
  if (modal.value && !modal.value.contains(event.target)) {
    showModal.value = false;
  }
};

const modalWidth = "350px"; // Adjust width based on your layout

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>