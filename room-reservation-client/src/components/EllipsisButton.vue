<template>
    <div class="relative inline-block">
      <!-- Ellipsis Button -->
      <button
        @click="toggleDropdown"
        class="text-gray-600 hover:text-gray-900 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-110 
               hover:bg-gray-200 rounded-full p-2"
      >
        <span class="text-xl">&#8942;</span> <!-- Ellipsis character -->
      </button>
  
      <!-- Dropdown Menu -->
      <div
        v-if="isDropdownVisible"
        class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
      >
        <ul>
          <li
            @click="handleOption('edit')"
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Edit
          </li>
          <li
            @click="handleOption('delete')"
            class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            Delete
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isDropdownVisible = ref(false);
  
  const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
  };
  
  const handleOption = (option) => {
    emit('option-selected', option);
    isDropdownVisible.value = false; // Close dropdown after selection
  };
  
  const emit = defineEmits(['option-selected']);
  </script>
  