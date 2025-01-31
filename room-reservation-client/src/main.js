import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config';
import Button from 'primevue/button';

import App from './App.vue'
import router from './router'
import { Drawer } from 'primevue';

const app = createApp(App)

app.use(PrimeVue);
app.component('Sidebar', Drawer);
app.component('Button', Button);
app.use(createPinia())
app.use(router)

app.mount('#app')
