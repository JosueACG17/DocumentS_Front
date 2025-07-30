import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authGuard } from './authGuard'

const CategoryDocumentsView = () => import('../views/CategoryDocumentsView.vue')
const AllDocumentsView = () => import('../views/AllDocumentsView.vue')
const AllCategoriesView = () => import('../views/AllCategoriesView.vue')
const AuditLogsView = () => import('../views/AuditLogsView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
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
    {
      path: '/audit-logs',
      name: 'audit-logs',
      component: AuditLogsView,
    },
  ],
})

router.beforeEach(authGuard)

export default router
