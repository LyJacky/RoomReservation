<template>
  <div class="container mx-auto p-6 font-sans">
    <h1 class="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
      Meeting Room Reservation
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <!-- Date Picker -->
      <div>
        <label class="block text-lg font-medium text-gray-700 mb-2">Select Date</label>
        <input 
          type="date" 
          v-model="selectedDate" 
          class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          @input="exitDisplay"
        />
      </div>

      <!-- Start Time Selection -->
      <div>
        <label class="block text-lg font-medium text-gray-700 mb-2">Start Time</label>
        <input 
          type="time" 
          v-model="startTime" 
          class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          @input="exitDisplay"
        />
      </div>

      <!-- End Time Selection -->
      <div>
        <label class="block text-lg font-medium text-gray-700 mb-2">End Time</label>
        <select 
          v-model="endTime" 
          class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-[51.25px]"
        >
          <option v-for="time in endTimeOptions" :key="time.value" :value="time.value">{{ time.label }}</option>
        </select>
      </div>
    </div>

    <!-- Duration & Filter Button Adjacent -->
    <div v-if="startTime && endTime" class="mt-4 flex items-center space-x-4 text-lg text-gray-700 leading-relaxed">
      <!-- Filter Button -->
      <button 
        @click="openFilterModal"
        class="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all"
      >
        <i class="fas fa-filter"></i> <!-- Font Awesome filter icon -->
        <span>Filter</span>
      </button>
      <!-- Duration Display -->
      <span>Duration: {{ duration }} minutes</span>
    </div>


    <!-- Search Button -->
    <div v-if="startTime && endTime && selectedDate" class="mt-6">
      <button 
        @click="searchAvailableRooms"
        class="bg-blue-600 text-white px-8 py-3 rounded-lg transition-all transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search Available Rooms
      </button>
      
    </div>

 <!-- Available Rooms -->

    <!-- Tabs for Available and Unavailable Rooms -->
    <div v-if="showAvailableRooms" class="mt-6">
      <div class="flex justify-between items-center border-b border-gray-200">
  <!-- Tabs (Available & Unavailable Rooms) -->
        <div class="flex space-x-4">
          <button 
            @click="activeTab = 'available'"
            :class="['py-2 px-4 text-lg font-semibold', activeTab === 'available' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500']"
          >
            Available Rooms ({{ availableRooms.length }})
          </button>
          <button 
            @click="activeTab = 'unavailable'"
            :class="['py-2 px-4 text-lg font-semibold', activeTab === 'unavailable' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500']"
          >
            Unavailable Rooms ({{ unavailableRooms.length }})
          </button>
        </div>
      </div>

      <!-- Available Rooms -->
      <div v-if="activeTab === 'available'" class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="room in availableRooms" 
            :key="room.id"
          >
            <RoomInfo 
              :room="room"
              :available="true" 
              @reserve="reserveRoom" 
              class="mb-4"
            />
          </div>
        </div>
      </div>

      <!-- Unavailable Rooms -->
      <div v-if="activeTab === 'unavailable'" class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="room in unavailableRooms" 
            :key="room.id"
          >
            <RoomInfo 
              :room="room"
              :false="false"
              class="mb-4"
            />
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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

const duration = computed(() => {
  if (startTime.value && endTime.value && selectedDate.value) {
    // Combine selectedDate with startTime and endTime to create full Date objects
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}`);
    const endDateTime = new Date(endTime.value);

    // Ensure end time is after start time
    if (endDateTime < startDateTime) {
      return 0;
    }

    // Calculate the duration in minutes
    return Math.max((endDateTime - startDateTime) / (1000 * 60), 0);
  }
  return 0;
});

const formatTime = (date) => {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

const updateEndTimeOptions = () => {
  if (!startTime.value || !selectedDate.value) return;
  
  const start = new Date(`${selectedDate.value}T${startTime.value}`);
  endTimeOptions.value = [];
  endTime.value = null; // Reset end time to force a new selection
  
  for (let i = 15; i <= 1440; i += 15) { // Limit to 3-hour max duration
    const newTime = new Date(start);
    newTime.setMinutes(newTime.getMinutes() + i);
    endTimeOptions.value.push({
      value: newTime.toISOString(),
      label: formatTime(newTime),
    });
  }
};

// Watch both startTime and selectedDate
watch([startTime, selectedDate], updateEndTimeOptions);

const searchAvailableRooms = async () => {
  try {
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}`).toISOString();
    const endDateTime = new Date(endTime.value).toISOString();

    const roomsResponse = await axios.get('http://localhost:8080/room');
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
    unavailableRooms.value = updatedUnavailableRooms
  } catch (error) {
    console.error('Search failed:', error);
  }
};
const exitDisplay = () => {
  showAvailableRooms.value = false;
}
const reserveRoom = async (room) => {
  try {
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}`).toISOString();
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
</script>