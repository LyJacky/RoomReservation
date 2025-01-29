import { createRouter, createWebHistory } from 'vue-router'
import RoomDisplay from '../views/RoomDisplay.vue'
import CreateRoom from '../views/CreateRoom.vue'
import DeleteRoom from '../views/DeleteRoom.vue'
import Reservation from '../views/Reservation.vue'
import UserPage from '../views/UserPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserPage,
    },
    {
      path: '/room',
      component: RoomDisplay
    },
    {
      path: '/create-room',
      component: CreateRoom
    },
    {
      path: '/delete-room',
      component: DeleteRoom
    },
    {
      path: '/reservations',
      component: Reservation
    }
  ],
})

export default router
