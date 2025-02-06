import { createRouter, createWebHistory } from 'vue-router'
import RoomManagement from '../views/RoomManagement.vue'
import ReservationPage from '../views/ReservationPage.vue'
import UserReservationDisplay from '../views/UserReservationDisplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserReservationDisplay,
    },
    {
      path: '/room',
      component: RoomManagement
    },
    {
      path: '/reservations',
      component: ReservationPage
    }
  ],
})

export default router
