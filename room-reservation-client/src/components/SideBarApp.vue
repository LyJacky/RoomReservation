<script setup>
import { RouterLink, useRoute } from 'vue-router';

const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['toggle']);
const route = useRoute();

const toggleSidebar = () => {
  emit('toggle');
};
</script>

<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-full bg-gradient-to-b from-gray-700 to-gray-900 text-white shadow-lg transform transition-all duration-300 ease-in-out',
      isSidebarOpen ? 'w-64' : 'w-16',
    ]"
  >
    <div class="p-4">
      <div v-if="isSidebarOpen">
        <RouterLink
          to="/"
          class="flex items-center py-3 px-4 rounded-lg transition-colors duration-200 mb-2 hover:bg-gray-500"
          :class="{ 'bg-gray-600': route.path === '/' }"
          @click="toggleSidebar"
        >
          <i class="fa fa-home mr-3"></i> My Reservations
        </RouterLink>
        <RouterLink
          to="/reservations"
          class="flex items-center py-3 px-4 rounded-lg transition-colors duration-200 mb-2 hover:bg-gray-500"
          :class="{ 'bg-gray-600': route.path === '/reservations' }"
          @click="toggleSidebar"
        >
          <i class="fa fa-calendar mr-3"></i> Reservations
        </RouterLink>
        <RouterLink
          to="/room"
          class="flex items-center py-3 px-4 rounded-lg transition-colors duration-200 mb-2 hover:bg-gray-500"
          :class="{ 'bg-gray-600': route.path === '/room' }"
          @click="toggleSidebar"
        >
          <i class="fa fa-building-o mr-3"></i> Rooms
        </RouterLink>
      </div>
      <div v-else class="flex flex-col items-center space-y-6 py-10">
        <RouterLink
          to="/"
          class="text-white text-3xl p-3 rounded-lg transition-colors duration-200 relative group hover:bg-gray-500"
          :class="{ 'bg-gray-600': route.path === '/' }"
          data-tooltip="My Reservations"
        >
          <i class="fa fa-home"></i>
          <span class="tooltip">My Reservations</span>
        </RouterLink>
        <RouterLink
          to="/reservations"
          class="text-white text-3xl p-3 rounded-lg transition-colors duration-200 relative group hover:bg-gray-500"
          :class="{ 'bg-gray-600': route.path === '/reservations' }"
          data-tooltip="Reservations"
        >
          <i class="fa fa-calendar"></i>
          <span class="tooltip">Reservations</span>
        </RouterLink>
        <RouterLink
          to="/room"
          class="text-white text-3xl p-3 rounded-lg transition-colors duration-200 relative group hover:bg-gray-500"
          :class="{ 'bg-gray-600': route.path === '/room' }"
          data-tooltip="Rooms"
        >
          <i class="fa fa-building-o"></i>
          <span class="tooltip">Rooms</span>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
}

.group:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
