import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer'; // Import Sidebar component
import Aura from '@primevue/themes/aura';
import Menu from 'primevue/menu';
import "primeicons/primeicons.css";
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
    styled: true,
});
app.component('Drawer', Drawer); // Register Sidebar component
app.component('Button', Button);
app.component('Menu', Menu);
app.use(pinia)
app.use(router)
const options = {
    // You can set your default options here
};

app.use(Toast, options);

app.mount('#app')
