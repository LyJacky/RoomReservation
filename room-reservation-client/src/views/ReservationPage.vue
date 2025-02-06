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
            <input type="date" v-model="dateSelectionStore.selectedDate"
              class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              @input="exitDisplay" :min="new Date().toLocaleDateString('en-CA')" />
          </div>

          <!-- Start Time Selection -->
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">Start Time</label>
            <input type="time" v-model="dateSelectionStore.startTime"
              class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              @input="exitDisplay" />
          </div>

          <!-- End Time Selection -->
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">End Time</label>
            <button @click.stop="showModal = !showModal"
              :disabled="!dateSelectionStore.startTime || !dateSelectionStore.selectedDate" :class="{
                'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300': !dateSelectionStore.startTime || !dateSelectionStore.selectedDate,
                'bg-white text-black': dateSelectionStore.startTime && dateSelectionStore.selectedDate
              }"
              class="w-full p-3 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-left">
              {{ dateSelectionStore.endTime ? formatTime(new Date(dateSelectionStore.endTime)) : 'Select End Time'
              }}
            </button>

            <!-- Modal for End Time Selection -->
            <div v-if="showModal" ref="modal"
              class="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
              :style="{ width: modalWidth, right: 0 }">
              <div class="p-3">
                <div class="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
                  <button v-for="time in endTimeOptions" :key="time.value" @click="selectEndTime(time.value)"
                    class="p-2 border border-gray-300 rounded-lg hover:bg-blue-100 transition-all text-sm">
                    <div>{{ formatTime(time.value) }}</div>
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
    <div v-if="dateSelectionStore.startTime && dateSelectionStore.endTime" class="mt-4 text-lg text-gray-700">
      Duration: {{ duration }} minutes
    </div>

    <!-- Minimum Capacity and Search Button -->
    <div v-if="dateSelectionStore.startTime && dateSelectionStore.endTime && dateSelectionStore.selectedDate"
      class="mt-4 flex items-end space-x-4">
      <!-- Minimum Capacity and Search Button -->
      <div v-if="dateSelectionStore.startTime && dateSelectionStore.endTime && dateSelectionStore.selectedDate"
        class="mt-4 flex items-end space-x-4">
        <form @submit.prevent="searchAvailableRooms" class="flex items-end space-x-4">
          <div class="w-64">
            <label class="block text-lg font-medium text-gray-700 mb-2">Minimum Capacity</label>
            <input type="number" min="1" required v-model="minCapacity"
              class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter minimum capacity" />
          </div>
          <!-- Button To Search for Rooms -->
          <div>
            <button type="submit"
              class="bg-blue-600 text-white px-8 py-3 rounded-lg transition-all transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Search Available Rooms
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Available Rooms -->
    <div v-if="showAvailableRooms" class="mt-6">
      <div class="flex justify-between items-center border-b border-gray-200">
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
        <!-- Submit Button -->
        <button v-if="selectedRooms.length > 0" @click="submitReservations"
          class="bg-green-500 text-white px-8 py-2 rounded-lg transition-all transform hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500">
          Submit Reservations
        </button>
      </div>
      <!-- Available Rooms -->
      <div v-if="activeTab === 'available'" class="mt-4">
        <div v-if="availableRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="room in availableRooms" :key="room.id">
            <RoomInfo :room="room" :available="true" :selectedRooms="selectedRooms" @reserve="reserveRoom"
              @remove="removeRoom" class="mb-4" />
          </div>
        </div>
        <p v-else class="text-gray-500 text-lg text-center">No available rooms found.</p>
      </div>

      <!-- Unavailable Rooms -->
      <div v-if="activeTab === 'unavailable'" class="mt-4">
        <div v-if="unavailableRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="room in unavailableRooms" :key="room.id">
            <RoomInfo :room="room" :available="false" :selectedRooms="selectedRooms" class="mb-4" />
          </div>
        </div>
        <p v-else class="text-gray-500 text-lg text-center">No unavailable rooms found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDateSelectionStore } from '../stores/DateSelectionStore';
import RoomInfo from '../components/RoomInfo.vue';
import { fetchNonValidRooms, createReservation } from '../services/ReservationService';
import { useToast } from 'vue-toastification';
import { formatTime } from '../services/TimeFormatService';
import { getRooms } from '../services/RoomService';

// Initialize store
const dateSelectionStore = useDateSelectionStore();

// Toast
const toast = useToast();

// Refs
const showAvailableRooms = ref(false);
const availableRooms = ref([]);
const unavailableRooms = ref([]);
const activeTab = ref('available');
const showModal = ref(false);
const modal = ref(null);
const minCapacity = ref(null);
const selectedRooms = ref([]);

// Computed property for end time options
const endTimeOptions = computed(() => {
  if (!dateSelectionStore.selectedDate || !dateSelectionStore.startTime) return [];

  const start = new Date(`${dateSelectionStore.selectedDate}T${dateSelectionStore.startTime}:00Z`);
  const options = [];

  for (let i = 15; i <= 300; i += 15) {
    const newTime = new Date(start);
    newTime.setMinutes(newTime.getMinutes() + i);
    const duration = i < 60 ? `${i}m` : `${Math.floor(i / 60)}h ${i % 60}m`;
    options.push({
      value: newTime.toISOString(),
      label: formatTime(newTime),
      duration,
    });
  }
  return options;
});


watch([() => dateSelectionStore.selectedDate, () => dateSelectionStore.startTime, () => dateSelectionStore.endTime], () => {
  // If any of the date or time values change, hide the available rooms
  showAvailableRooms.value = false;
  selectedRooms.value = []
}
);
watch([() => minCapacity.value], () => {
  // When capacity changes, hide the available rooms and clear selected rooms
  showAvailableRooms.value = false;
  selectedRooms.value = [];
});


// Computed property for duration
const duration = computed(() => {
  if (dateSelectionStore.startTime && dateSelectionStore.endTime && dateSelectionStore.selectedDate) {
    const startDateTime = new Date(`${dateSelectionStore.selectedDate}T${dateSelectionStore.startTime}:00Z`);
    const endDateTime = new Date(dateSelectionStore.endTime);

    if (endDateTime < startDateTime) {
      return 0;
    }

    return Math.max((endDateTime - startDateTime) / (1000 * 60), 0);
  }
  return 0;
});

const selectEndTime = (time) => {
  dateSelectionStore.endTime = time;
  showModal.value = false;
  exitDisplay();
};

const searchAvailableRooms = async () => {
  try {
    const startDateTime = new Date(`${dateSelectionStore.selectedDate}T${dateSelectionStore.startTime}:00Z`).toISOString();
    const endDateTime = new Date(dateSelectionStore.endTime).toISOString();
    const allRooms = await getRooms();
    // gets a subset of rooms of all rooms
    const rooms = await getRooms(minCapacity.value);
    // find all rooms that conflict with that time
    const reservations = await fetchNonValidRooms(startDateTime, endDateTime);
    const reservationIds = new Set(reservations.map(reservation => reservation._id.toString()));

    availableRooms.value = rooms.filter(room => !reservationIds.has(room._id.toString()));
    const roomWithNotValidCapacity = allRooms.filter((room) => !rooms.some((r) => r._id === room._id));
    const unavailRoomConcat = rooms.filter(room => reservationIds.has(room._id.toString())).concat(roomWithNotValidCapacity);
    unavailableRooms.value = unavailRoomConcat;

    showAvailableRooms.value = true;
    selectedRooms.value = []
  } catch (error) {
    console.error('Search failed:', error);
  }
};

const exitDisplay = () => {
  showAvailableRooms.value = false;
};

const reserveRoom = (room) => {
  selectedRooms.value.push(room);
};

const removeRoom = (room) => {
  selectedRooms.value = selectedRooms.value.filter(r => r._id !== room._id);
};

const submitReservations = async () => {
  try {
    const startDateTime = new Date(`${dateSelectionStore.selectedDate}T${dateSelectionStore.startTime}:00Z`).toISOString();
    const endDateTime = new Date(dateSelectionStore.endTime).toISOString();

    for (const room of selectedRooms.value) {
      await createReservation({
        room_id: room._id,
        start_time: startDateTime,
        end_time: endDateTime,
        created_by_name: "Jacky",
        status: "active",
      });
      toast.success(`Successfully reserved room: ${room.name}`);
    }

    selectedRooms.value = [];
    minCapacity.value = 1;
    await searchAvailableRooms();
    dateSelectionStore.clearState();
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

const modalWidth = "350px";

onMounted(() => {
  minCapacity.value = 1;
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>