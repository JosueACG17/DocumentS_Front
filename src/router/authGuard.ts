import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['login']

  // Si la ruta es pública, permitir acceso
  if (publicRoutes.includes(to.name as string)) {
    // Si el usuario ya está autenticado y trata de ir a login/register, redirigir a home
    if (authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
    next()
    return
  }

  // Para rutas protegidas, verificar autenticación
  if (!authStore.isAuthenticated) {
    // Si no está autenticado, redirigir a login
    next({ name: 'login' })
    return
  }

  // Si está autenticado, permitir acceso
  next()
}
