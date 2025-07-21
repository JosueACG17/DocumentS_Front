import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const CategoryDocumentsView = () => import('../views/CategoryDocumentsView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/categoria/:id',
      name: 'category-documents',
      component: CategoryDocumentsView,
      props: true,
    },
  ],
})

export default router
