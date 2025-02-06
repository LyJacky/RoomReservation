import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useDateSelectionStore = defineStore('dateSelection', () => {
    // Initialize refs with stored values
    const selectedDate = ref(localStorage.getItem('selectedDate') || '');
    const startTime = ref(localStorage.getItem('startTime') || '');
    const endTime = ref(localStorage.getItem('endTime') || '');

    // Watch for changes in selectedDate
    watch(selectedDate, (newValue) => {
        if (newValue) {
            localStorage.setItem('selectedDate', newValue);
            if (endTime.value) {
                endTime.value = '';
                localStorage.removeItem('endTime');
            }
        }
    });

    // Watch for changes in startTime
    watch(startTime, (newValue) => {
        if (newValue) {
            localStorage.setItem('startTime', newValue);
            if (endTime.value) {
                endTime.value = '';
                localStorage.removeItem('endTime');
            }
        }
    });

    // Watch for changes in endTime
    watch(endTime, (newValue) => {
        if (newValue) {
            localStorage.setItem('endTime', newValue);
            endTime.value = newValue;
        } else {
            localStorage.removeItem('endTime');
        }
    });

    const clearState = () => {
        selectedDate.value = '';
        startTime.value = '';
        endTime.value = '';
        localStorage.removeItem('selectedDate');
        localStorage.removeItem('startTime');
        localStorage.removeItem('endTime');
    };

    return {
        selectedDate,
        startTime,
        endTime,
        clearState
    };
});
