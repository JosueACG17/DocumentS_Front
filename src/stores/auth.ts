import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'

interface User {
  id?: number
  username: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  const setAuth = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken

    Cookies.set('auth_token', authToken, {
      expires: 7,
      secure: import.meta.env.PROD,
      sameSite: 'lax'
    })
    Cookies.set('user_data', JSON.stringify(userData), {
      expires: 7,
      secure: import.meta.env.PROD,
      sameSite: 'lax'
    })
  }

  const loadAuthFromCookies = () => {
    const cookieToken = Cookies.get('auth_token')
    const cookieUser = Cookies.get('user_data')

    if (cookieToken && cookieUser) {
      try {
        token.value = cookieToken
        user.value = JSON.parse(cookieUser)
        return true
      } catch (error) {
        console.error('Error parsing user data from cookies:', error)
        clearAuth()
        return false
      }
    }
    return false
  }

  const clearAuth = () => {
    user.value = null
    token.value = null

    Cookies.remove('auth_token')
    Cookies.remove('user_data')
  }

  const logout = () => {
    clearAuth()
  }

  loadAuthFromCookies()

  return {
    user,
    token,
    isAuthenticated,
    currentUser,
    setAuth,
    loadAuthFromCookies,
    clearAuth,
    logout
  }
})
