<template>
  <div class="relative flex items-center justify-center" ref="menuContainer">
    <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
      class="p-button-text p-button-sm p-2 border border-gray-300 text-gray-600 hover:text-gray-800" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import Button from "primevue/button";
import Menu from "primevue/menu";

const menu = ref();
const menuContainer = ref();
const emit = defineEmits(["option-selected"]);

const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => emit("option-selected", "edit"),
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => emit("option-selected", "delete"),
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<style scoped>
:deep(.p-button.p-button-text) {
  color: #4b5563 !important;
}

:deep(.p-button.p-button-text:hover) {
  background: #f3f4f6 !important;
  color: #1f2937 !important;
}

:deep(.p-button.p-button-text:focus) {
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px #9ca3af !important;
}
</style>