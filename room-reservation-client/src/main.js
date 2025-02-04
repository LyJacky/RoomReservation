import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';

import App from './App.vue'
import router from './router'
import { Drawer } from 'primevue';

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue);
app.component('Sidebar', Drawer);
app.component('Button', Button);
app.use(pinia)
app.use(router)
const options = {
    // You can set your default options here
};

app.use(Toast, options);

app.mount('#app')
