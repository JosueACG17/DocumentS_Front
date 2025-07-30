<template>
  <header
    :class="['relative z-10 backdrop-blur-sm border-b', themeStore.dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200']">
    <div class="mx-auto px-4 sm:px-6 py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <!-- Logo + Título -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div
            :class="['w-10 h-10 bg-gradient-to-r rounded-xl flex items-center justify-center', themeStore.dark ? 'from-purple-700 to-cyan-600' : 'from-purple-700 to-cyan-600']">
            <FileText class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              :class="['text-xl sm:text-2xl font-bold bg-clip-text', themeStore.dark ? 'bg-gradient-to-r from-white to-gray-300 text-transparent' : 'text-gray-900']">
              Organizador de Documentos
            </h1>
            <p :class="themeStore.dark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
              Organiza tus Documentos de manera Inteligente
            </p>
          </div>
        </div>

        <!-- Contador + Usuario + Tema -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-start sm:justify-end">
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
            v-if="themeStore.dark">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-300">{{ totalDocs }} documentos</span>
          </div>
          <div class="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2" v-else>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-700">{{ totalDocs }} documentos</span>
          </div>

          <!-- Usuario logueado -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3">
            <div
              :class="['flex items-center space-x-2 rounded-full px-3 py-2', themeStore.dark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-700']">
              <User class="w-4 h-4" />
              <span class="text-sm font-medium">{{ authStore.currentUser?.username }}</span>
            </div>

            <!-- Botón de cerrar sesión -->
            <button @click="handleLogout"
              :class="['p-2 rounded-lg transition-colors duration-200 cursor-pointer', themeStore.dark ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-600 hover:text-red-600 hover:bg-red-50']"
              title="Cerrar Sesión">
              <LogOut class="w-5 h-5" />
            </button>
          </div>

          <!-- Botón de tema -->
          <button @click="themeStore.toggleTheme()"
            :class="['p-2 rounded-lg transition-colors duration-200 cursor-pointer', themeStore.dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100']">
            <svg v-if="themeStore.dark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Logout -->
    <Teleport to="body">
      <ConfirmModal :is-open="showLogoutModal" type="warning" title="¿Cerrar Sesión?"
        message="¿Estás seguro de que quieres cerrar sesión? Serás redirigido a la página de inicio de sesión."
        confirm-text="Sí, cerrar sesión" cancel-text="Cancelar" @confirm="confirmLogout"
        @cancel="showLogoutModal = false" @close="showLogoutModal = false" />
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { FileText, User, LogOut } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useDocumentsStore } from '@/stores/documents'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()
const authStore = useAuthStore()
const router = useRouter()
const showLogoutModal = ref(false)

const totalDocs = computed(() => documentsStore.documents.length)

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
  router.push({ name: 'login' })
}
</script>
