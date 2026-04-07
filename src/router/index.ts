import { createRouter, createWebHistory } from 'vue-router'
import ListenDetail from '../views/ListenDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/listen?id=1309'
    },
    {
      path: '/listen',
      name: 'listen-detail',
      component: ListenDetail
    }
  ]
})

export default router
