<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Meeting Room Reservation</h1>

    <div class="space-y-6">
      <!-- Date Picker -->
      <div class="space-y-2">
        <label class="block text-lg font-medium text-gray-700">Select Date</label>
        <input 
          type="date" 
          v-model="selectedDate" 
          class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      <!-- Time Slot Selection -->
      <div v-if="selectedDate" class="space-y-2">
        <label class="block text-lg font-medium text-gray-700">Start Time</label>
        <input 
          type="time" 
          v-model="startTime" 
          class="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      <!-- Duration Control -->
      <div v-if="startTime" class="flex items-center justify-between space-x-4">
        <span class="text-lg text-gray-700">Duration: {{ duration }} minutes</span>
        <div class="space-x-2">
          <button 
            @click="increaseDuration" 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            +15 min
          </button>
          <button 
            @click="decreaseDuration" 
            class="bg-red-600 text-white px-4 py-2 rounded-lg transition-all transform hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
            :disabled="duration <= 15"
          >
            -15 min
          </button>
        </div>
      </div>

      <!-- Search Button -->
      <div v-if="startTime" class="mt-6">
        <button 
          @click="searchAvailableRooms"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg transition-all transform hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search Available Rooms
        </button>
      </div>

      <!-- Available Rooms -->
      <div v-if="showAvailableRooms" class="mt-6 space-y-4">
        <h2 class="text-xl font-semibold text-gray-800">Available Rooms</h2>
        <div 
          v-for="room in availableRooms" 
          :key="room.id"
        >
          <RoomInfo 
            :room="room" 
            @reserve="reserveRoom" 
            class="mb-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import RoomInfo from '../components/RoomInfo.vue';

const selectedDate = ref(null);
const startTime = ref(null);
const duration = ref(15);
const showAvailableRooms = ref(false);
const availableRooms = ref([]);

const mockRooms = [
  {
    id: 1,
    name: 'Salle #5',
    description: 'Salle #5',
    capacity: 5,
    equipments: [
      { name: 'Projector' },
      { name: 'Whiteboard' },
    ],
  },
  {
    id: 2,
    name: 'Conference Room A',
    description: 'A spacious room for conferences.',
    capacity: 10,
    equipments: [
      { name: 'Teleconference System' },
      { name: 'Whiteboard' },
    ],
  },
  {
    id: 3,
    name: 'Training Room B',
    description: 'Perfect for training sessions.',
    capacity: 12,
    equipments: [
      { name: 'Projector' },
      { name: 'Flipchart' },
    ],
  },
];

const searchAvailableRooms = async () => {
  try {

    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}`).toISOString();
    const endDateTime = new Date(`${selectedDate.value}T${startTime.value}`);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration.value);

    const roomsResponse = await axios.get('http://localhost:8080/room');
    const rooms = roomsResponse.data;

    const reservationsResponse = await axios.get('http://localhost:8080/reservation/nonValid', {
      params: {
        start_time: startDateTime,
        end_time: endDateTime.toISOString(),
      },
    });
    
    const reservations = reservationsResponse.data;
    console.log(reservations)
    console.log(rooms)
    
    // Create a Set of reservation _ids for fast lookup
    const reservationIds = new Set(reservations.map(reservation => reservation._id.toString()));
    console.log(reservationIds)
    // Filter rooms by checking if their _id is NOT in the reservationIds Set
    const updatedRooms = rooms.filter(room => !reservationIds.has(room._id.toString()));
    console.log(updatedRooms)

    // can make avaialble rooms in the pinia store after i click reserve
    availableRooms.value = updatedRooms; // Replace with actual filtering logic
    showAvailableRooms.value = true;
  } catch (error) {
    console.error('Search failed:', error);
  }
};

const reserveRoom = async (room) => {
  try {
    const startDateTime = new Date(`${selectedDate.value}T${startTime.value}`).toISOString();
    const endDateTime = new Date(`${selectedDate.value}T${startTime.value}`);
    endDateTime.setMinutes(endDateTime.getMinutes() + duration.value);
    await axios.post('http://localhost:8080/reservation', {
      room_id: room._id,
      start_time: startDateTime,
      end_time: endDateTime,
      created_by_name: "Jacky",
      status: "active"
    });
    await searchAvailableRooms();
    // wondering if i can just remove that from the array here, so i don't have to reload the page or make more API calls.

  } catch (error) {
    console.error('Reservation failed:', error);
  }
};

const increaseDuration = () => {
  duration.value += 15;
};

const decreaseDuration = () => {
  if (duration.value > 15) {
    duration.value -= 15;
  }
};
</script>
