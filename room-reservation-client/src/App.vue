
<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white p-4 flex justify-end items-center fixed top-0 left-0 w-full z-50">
      <!-- User Info -->
      <div class="flex items-center space-x-3">
        <span class="text-sm font-semibold">Jacky</span>
        <div class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <i class="fa fa-user text-white"></i>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex flex-1 pt-16">
      <!-- Sidebar -->
      <Sidebar :isSidebarOpen="isSidebarOpen" @toggle="toggleSidebar" class="z-50" />

      <!-- Sidebar Toggle Button -->
      <button @click="toggleSidebar" :class="[
        'fixed top-4 p-2 bg-gray-800 text-white rounded-lg z-50 transition-all duration-300 ease-in-out hover:bg-gray-700',
        isSidebarOpen ? 'left-64' : 'left-4',
      ]">
        <i class="fa fa-bars"></i>
      </button>

      <!-- Router View -->
      <main :class="[
        'flex-1 p-6 transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'ml-64' : 'ml-16',
      ]">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import 'font-awesome/css/font-awesome.min.css';
import { ref, onMounted } from 'vue';
import Sidebar from './components/SideBarApp.vue';
import 'vue-toastification/dist/index.css';
import { useDateSelectionStore } from './stores/DateSelectionStore';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const dateSelectionStore = useDateSelectionStore();

const fetchDateSelections = async () => {
  try {
    dateSelectionStore.selectedDate = await localStorage.getItem('selectedDate') || '';
    dateSelectionStore.startTime = await localStorage.getItem('startTime') || '';
    dateSelectionStore.endTime = await localStorage.getItem('endTime') || '';
  } catch (error) {
    console.error('Failed to fetch date selections:', error);
  }
};

onMounted(async () => {
  await fetchDateSelections();
});

</script>
