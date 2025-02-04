<template>
    <div class="border rounded-lg p-4 flex justify-between items-center bg-white shadow">
        <div>
            <!-- Reserved by -->
            <h3 class="font-semibold text-xl">Reserved by: {{ reservation.created_by_name }}</h3>

            <!-- Room Name -->
            <h3 class="font-semibold text-xl">Room Name: {{ reservation.room_id?.name }}</h3>

            <!-- Start and End Time -->
            <p class="text-gray-600 text-sm">
                {{ formatDate(reservation.start_time) }} at {{ formatTime(reservation.start_time) }} -
                {{ formatDate(reservation.end_time) }} at {{ formatTime(reservation.end_time) }}
            </p>

            <!-- Duration -->
            <i class="text-gray-600 fa fa-hourglass-half"></i>
            <span class="text-gray-600 ml-0.5 text-sm"> {{ reservation.duration }} minutes</span>
        </div>

        <!-- Cancel Button -->
        <button @click="onCancel" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cancel
        </button>
    </div>
</template>
  
<script setup>
import { formatTime, formatDate } from '../services/TimeFormatService'
const props = defineProps({
    reservation: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['cancel']);


const onCancel = () => {
    emit('cancel', props.reservation._id);
};
</script>
  
<style scoped>
/* Add any custom styles here */
</style>