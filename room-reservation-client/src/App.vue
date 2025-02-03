<script setup>
import { RouterView } from 'vue-router';
import 'font-awesome/css/font-awesome.min.css';
import { ref } from 'vue';
import Sidebar from './components/SideBarApp.vue'; // Import the Sidebar component
// import { Toast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

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
    <div class="flex flex-1 pt-16"> <!-- Add padding-top to account for the fixed navbar -->
      <!-- Sidebar -->
      <Sidebar :isSidebarOpen="isSidebarOpen" @toggle="toggleSidebar" class="z-50" />

      <!-- Sidebar Toggle Button -->
      <button @click="toggleSidebar" :class="[
        'fixed top-4 p-2 bg-gray-800 text-white rounded-lg z-50 transition-all duration-300 ease-in-out z-50',
        isSidebarOpen ? 'left-64' : 'left-4', // Adjust position based on sidebar state
      ]">
        <i class="fa fa-bars"></i>
      </button>

      <!-- Router View -->
      <main :class="[
        'flex-1 p-6 transition-all duration-300 ease-in-out',
        isSidebarOpen ? 'ml-64' : 'ml-16', // Adjust margin based on sidebar width
      ]">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add custom styles here */
</style>