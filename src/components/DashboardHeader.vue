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

        <!-- Contador + Tema -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 justify-start sm:justify-end">
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
            v-if="themeStore.dark">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-300">{{ totalDocuments }} documentos</span>
          </div>
          <div class="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2" v-else>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-700">{{ totalDocuments }} documentos</span>
          </div>

          <!-- Botón de cambio de tema -->
          <button @click="themeStore.toggleTheme()"
            class="p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
            :class="themeStore.dark ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'">
            <svg v-if="themeStore.dark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="5" stroke="currentColor" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-linecap="round" />
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-linecap="round" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-linecap="round" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-linecap="round" />
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-linecap="round" />
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-linecap="round" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-linecap="round" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-linecap="round" />
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
  </header>
</template>


<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

interface Props {
  totalDocuments: number
}

const themeStore = useThemeStore()
defineProps<Props>()
</script>
