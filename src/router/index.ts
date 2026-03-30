import { createRouter, createWebHistory } from 'vue-router'
import ListenDetail from '../views/ListenDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/listen/1309'
    },
    {
      path: '/listen/:id',
      name: 'listen-detail',
      component: ListenDetail
    }
  ]
})

export default router
