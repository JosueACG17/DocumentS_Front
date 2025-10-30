import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  const publicRoutes = ['login', 'register']

  if (publicRoutes.includes(to.name as string)) {
    if (authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }

  next()
}
