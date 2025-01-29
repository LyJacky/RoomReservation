<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex space-x-4">
      <RouterLink 
        to="/" 
        class="text-white hover:text-gray-300"
      >
        Home
      </RouterLink>
      <RouterLink 
        to="/room" 
        class="text-white hover:text-gray-300"
      >
        Rooms
      </RouterLink>
      <RouterLink 
        to="/reservations" 
        class="text-white hover:text-gray-300"
      >
        Reservations
      </RouterLink>
    </div>
  </nav>
  <RouterView/>
</template>