<template>
  <NotificationComponent v-if="showNotification" :type="notificationType" :message="notificationMessage"
    :duration="4000" class="fixed top-8 right-0 z-[9999] w-[420px] max-w-full"
    style="border-radius: 1.5rem 0 0 1.5rem;" />
  <div
    :class="['min-h-screen transition-colors duration-300', themeStore.dark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900']">
    <DashboardHeader :total-documents="totalDocuments" />
    <div class="relative z-10 mx-auto px-6 py-8">
      <button @click="goHome" :class="[
        'cursor-pointer mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow transition-colors',
        themeStore.dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      ]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Regresar</span>
      </button>

      <!-- Contenedor principal con título, buscador, filtro y botón -->
      <div class="flex flex-wrap items-center justify-between mb-8 gap-4">
        <h2 :class="['text-2xl font-bold flex items-center', themeStore.dark ? 'text-white' : 'text-gray-900']">
          <FileText class="w-7 h-7 mr-2 text-green-400" />
          Todos los Documentos
        </h2>

        <div class="flex flex-wrap gap-3 items-center justify-end flex-1 min-w-[300px]">
          <!-- Input de búsqueda -->
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              :class="themeStore.dark ? 'text-gray-400' : 'text-gray-500'" />
            <input v-model="search" type="text" placeholder="Buscar archivo..."
              class="pl-10 pr-4 py-2 w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              :class="themeStore.dark
                ? 'bg-white/10 text-white placeholder-gray-400 border-white/20'
                : 'bg-white text-gray-900 placeholder-gray-400 border-gray-300'" />
          </div>

          <!-- Selector de filtro -->
          <div class="relative w-full sm:w-60">
            <select v-model="filter"
              class="py-2 px-4 w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
              :class="themeStore.dark
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white text-gray-900 border-gray-300'">
              <option value="" :class="themeStore.dark ? 'bg-black' : 'bg-white '">Todas las extensiones</option>
              <option value="pdf" :class="themeStore.dark ? 'bg-black' : 'bg-white '">PDF</option>
              <option value="docx" :class="themeStore.dark ? 'bg-black' : 'bg-white '">Word</option>
            </select>
          </div>

          <!-- Botón Descargar Todo -->
          <button v-if="filteredDocuments.length > 0" @click="downloadAll"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors whitespace-nowrap cursor-pointer"
            :class="themeStore.dark
              ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
              : 'bg-blue-100 hover:bg-blue-200 text-blue-600'">
            <Download class="w-5 h-5" />
            Descargar todo
          </button>
        </div>
      </div>

      <!-- Grid de documentos -->
      <div v-if="filteredDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in filteredDocuments" :key="doc.id" :class="[
          'group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-105 shadow-lg border',
          themeStore.dark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
        ]">
          <div class="flex items-center justify-between mb-3">
            <div :class="getFileIcon(doc.extension).bg"
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
              <component :is="getFileIcon(doc.extension).icon" />
            </div>
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="downloadDocument(doc.id)"
                :class="[themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200', 'p-1.5 rounded-md transition-colors cursor-pointer']">
                <Download :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'" class="w-4 h-4" />
              </button>
              <button @click="viewDocument(doc.id)"
                :class="[themeStore.dark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200', 'p-1.5 rounded-md transition-colors cursor-pointer']">
                <Eye :class="themeStore.dark ? 'text-green-400' : 'text-green-600'" class="w-4 h-4" />
              </button>
              <button @click="deleteDocument(doc.id)"
                :class="[themeStore.dark ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-red-100 hover:bg-red-200', 'p-1.5 rounded-md transition-colors cursor-pointer']"
                title="Eliminar documento">
                <Trash2 :class="themeStore.dark ? 'text-red-400' : 'text-red-600'" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <h4 :class="['font-medium text-base mb-1 truncate', themeStore.dark ? 'text-white' : 'text-gray-900']">{{
            doc.name }}</h4>
          <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
            {{ doc.extension.toUpperCase() }} • {{ doc.size }} • {{ doc.category }}
          </p>
        </div>
      </div>

      <div v-else :class="[
        'flex flex-col items-center justify-center py-24 px-6 space-y-6  mx-auto text-center rounded-lg shadow-lg transition-colors duration-500',
        themeStore.dark ? 'bg-neutral-800 text-gray-400' : 'bg-gray-100 text-gray-700'
      ]">
        <FileX :class="[
          'w-24 h-24 mb-4',
          themeStore.dark ? 'text-red-500 animate-bounce' : 'text-red-400 animate-bounce'
        ]" />
        <h3 class="text-2xl font-semibold tracking-tight select-none">
          No encontramos lo que buscas
        </h3>
        <p class="text-sm max-w-xs mx-auto text-gray-500 dark:text-gray-400">
          Parece que no hay documentos que coincidan con tu búsqueda o filtro.<br />
          Intenta cambiar los términos de búsqueda o los filtros para encontrar resultados.
        </p>
        <button @click="resetFilters" :class="[
          'mt-4 px-5 py-2 rounded-md font-semibold shadow-md transition-colors duration-300 cursor-pointer',
          themeStore.dark
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-red-400 hover:bg-red-500 text-white'
        ]">
          Limpiar filtros
        </button>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/DashboardHeader.vue'
import { FileText, Download, Eye, FileX, Search, Trash2 } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { CATEGORIES_DATA } from '@/constants/mockData'
import type { Document } from '@/types'
import { useDocumentsStore } from '@/stores/documents'
import { useThemeStore } from '@/stores/theme'
import { DocumentService } from '@/services/DocumentService'
import NotificationComponent from '@/components/NotificationComponent.vue'

const themeStore = useThemeStore()
const router = useRouter()

function goHome() {
  router.push('/')
}

const totalDocuments = CATEGORIES_DATA.reduce((acc, c) => acc + c.count, 0)

const documentsStore = useDocumentsStore()

// Notificación global
const showNotification = ref(false)
const notificationType = ref<'success' | 'error' | 'info' | 'warning'>('success')
const notificationMessage = ref('')

// Mapea DocumentData a Document para la vista
const allDocuments = computed<Document[]>(() => {
  return documentsStore.documents.map((doc, idx) => ({
    id: idx + 1, // Si tienes un id real, úsalo
    name: doc.filename,
    category: doc.categories[0] || 'Sin categoría',
    extension: doc.filename.split('.').pop() || '',
    size: doc.content ? `${(doc.content.length / 1024).toFixed(1)} KB` : '',
    date: '', // Si tienes fecha, mapea aquí
  }))
})

onMounted(() => {
  documentsStore.fetchDocuments()
})

const filter = ref('')
const search = ref('')

function resetFilters() {
  search.value = ''
  filter.value = ''
}

const filteredDocuments = computed(() => {
  let docs = allDocuments.value
  // Filtro por extensión
  if (filter.value === 'pdf' || filter.value === 'docx') {
    docs = docs.filter(doc => doc.extension.toLowerCase() === filter.value)
  }
  // Filtro por búsqueda insensible a mayúsculas/minúsculas
  if (search.value.trim() !== '') {
    const searchTerm = search.value.trim().toLowerCase()
    docs = docs.filter(doc => doc.name.toLowerCase().includes(searchTerm))
  }
  return docs
})

async function downloadAll() {
  try {
    const response = await DocumentService.downloadAllDocuments()
    // El endpoint retorna un Blob directamente, no response.data
    console.log('Respuesta de descarga:', response)
    if (response instanceof Blob) {
      const url = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'documentos.zip')
      document.body.appendChild(link)
      link.click()
      link.remove()
      showNotification.value = true
      notificationType.value = 'success'
      notificationMessage.value = '¡Descarga iniciada!'
      setTimeout(() => { showNotification.value = false }, 4000)
    } else if (response && response.data instanceof Blob) {
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'documentos.zip')
      document.body.appendChild(link)
      link.click()
      link.remove()
      showNotification.value = true
      notificationType.value = 'success'
      notificationMessage.value = '¡Descarga iniciada!'
      setTimeout(() => { showNotification.value = false }, 4000)
    } else {
      console.error('La respuesta no es un Blob:', response)
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'La respuesta no es un archivo descargable.'
      setTimeout(() => { showNotification.value = false }, 4000)
    }
  } catch (err) {
    console.error('Error al descargar:', err)
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'Error al descargar los documentos'
    setTimeout(() => { showNotification.value = false }, 4000)
  }
}

function downloadDocument(id: number) {
  alert('Descargar documento ' + id)
}

function viewDocument(id: number) {
  alert('Ver documento ' + id)
}

function deleteDocument(id: number) {
  alert('Eliminar documento ' + id)
}
</script>
