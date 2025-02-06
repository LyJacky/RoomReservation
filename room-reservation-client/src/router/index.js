import { createRouter, createWebHistory } from 'vue-router'
import RoomDisplay from '../views/RoomDisplay.vue'
import Reservation from '../views/Reservation.vue'
import ReservationDisplay from '../views/ReservationDisplay.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ReservationDisplay,
    },
    {
      path: '/room',
      component: RoomDisplay
    },
    {
      path: '/reservations',
      component: Reservation
    }
  ],
})

export default router
