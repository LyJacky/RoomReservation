<template>
    <div class="border rounded-lg p-4 flex justify-between items-center bg-white shadow">
        <div>
            <!-- Reserved by -->
            <h3 class="font-bold">Reserved by: {{ reservation.created_by_name }}</h3>

            <!-- Room Name -->
            <h3 class="font-bold">Room Name: {{ reservation.room_id?.name }}</h3>

            <!-- Start and End Time -->
            <p class="text-gray-600">
                {{ formatDate(reservation.start_time) }} at {{ formatTime(reservation.start_time) }} -
                {{ formatDate(reservation.end_time) }} at {{ formatTime(reservation.end_time) }}
            </p>

            <!-- Duration -->
            <p>Duration: {{ reservation.duration }} minutes</p>
        </div>

        <!-- Cancel Button -->
        <button @click="onCancel" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cancel
        </button>
    </div>
</template>
  
<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    reservation: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['cancel']);

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

const onCancel = () => {
    emit('cancel', props.reservation._id);
};
</script>
  
<style scoped>
/* Add any custom styles here */
</style>