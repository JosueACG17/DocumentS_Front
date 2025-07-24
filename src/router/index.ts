import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const CategoryDocumentsView = () => import('../views/CategoryDocumentsView.vue')

const AllDocumentsView = () => import('../views/AllDocumentsView.vue')

const AllCategoriesView = () => import('../views/AllCategoriesView.vue')

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
    {
      path: '/todos',
      name: 'all-documents',
      component: AllDocumentsView,
    },
    {
      path: '/categorias',
      name: 'all-categories',
      component: AllCategoriesView,
    },
  ],
})

export default router
