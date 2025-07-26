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

    <!-- Modal de Previsualización de Documentos -->
    <div v-if="showPreviewModal"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div :class="[
        themeStore.dark
          ? 'bg-neutral-800 text-white border-white/10'
          : 'bg-white text-neutral-800 border-gray-200',
        'rounded-xl border shadow-2xl relative transform transition-all duration-300 scale-100',
        'w-[95vw] h-[95vh] max-w-7xl max-h-[95vh] overflow-hidden flex flex-col'
      ]">
        <!-- Header del Modal -->
        <div class="flex items-center justify-between p-6 border-b"
          :class="themeStore.dark ? 'border-white/10' : 'border-gray-200'">
          <div class="flex items-center space-x-3">
            <div :class="getFileIcon(previewDocument?.extension || '').bg"
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
              <component :is="getFileIcon(previewDocument?.extension || '').icon" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ previewDocument?.name }}</h3>
              <p class="text-sm opacity-70">Previsualización del documento</p>
            </div>
          </div>
          <button @click="closePreviewModal" :class="[
            themeStore.dark
              ? 'hover:bg-neutral-700 text-neutral-300'
              : 'hover:bg-gray-100 text-gray-500',
            'p-2 rounded-full transition-colors cursor-pointer'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido del Modal -->
        <div class="flex-1 overflow-hidden">
          <!-- Loading -->
          <div v-if="previewLoading" class="flex items-center justify-center h-full">
            <div class="flex flex-col items-center space-y-4">
              <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-lg font-medium">Cargando previsualización...</p>
            </div>
          </div>

          <!-- PDF Preview -->
          <div v-else-if="previewType === 'pdf' && previewContent" class="h-full">
            <VuePdfApp :pdf="previewContent" :config="{
              sidebar: { thumbnails: true, outline: true },
              toolbar: { toolbarViewerLeft: { findbar: true, previous: true, next: true, pageNumber: true } }
            }" class="h-full w-full" />
          </div>

          <!-- DOCX Preview -->
          <div v-else-if="previewType === 'docx' && previewContent" class="h-full overflow-auto p-8"
            :class="themeStore.dark ? 'bg-neutral-900' : 'bg-gray-200'">
            <div :class="[
              'max-w-4xl mx-auto p-8 rounded-lg shadow-lg prose prose-lg',
              themeStore.dark ? 'bg-neutral-700 prose-invert' : 'bg-white'
            ]">
              <div v-html="previewContent" class="docx-content"></div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
              <FileX class="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p class="text-lg font-medium mb-2">No se pudo cargar la previsualización</p>
              <p class="text-sm opacity-70">El documento no está disponible o el formato no es compatible</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación -->
    <BaseModal :visible="showDeleteModal" title="Confirmar eliminación" subtitle="Esta acción no se puede deshacer"
      :header-icon="AlertTriangle" icon-color="red" @close="closeDeleteModal">
      <!-- Información del archivo -->
      <div class="flex items-center p-4 rounded-lg"
        :class="themeStore.dark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'">
        <Trash2 :class="themeStore.dark ? 'text-red-400' : 'text-red-600'" class="w-6 h-6 mr-3 flex-shrink-0" />
        <div>
          <p class="font-medium">¿Estás seguro de que deseas eliminar este documento?</p>
          <p class="text-sm opacity-80 mt-1">{{ fileToDelete?.name }}</p>
        </div>
      </div>

      <!-- Botones de acción -->
      <template #actions>
        <div class="flex space-x-3">
          <button @click="closeDeleteModal"
            class="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
            :class="themeStore.dark ? 'bg-neutral-600 hover:bg-neutral-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'">
            Cancelar
          </button>
          <button @click="confirmDeleteDocument"
            class="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer bg-red-600 hover:bg-red-700 text-white">
            Eliminar
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/DashboardHeader.vue'
import BaseModal from '@/components/BaseModal.vue'
import { FileText, Download, Eye, FileX, Search, Trash2, AlertTriangle } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { CATEGORIES_DATA } from '@/constants/mockData'
import type { Document } from '@/types'
import { useDocumentsStore } from '@/stores/documents'
import { useThemeStore } from '@/stores/theme'
import { DocumentService } from '@/services/DocumentService'
import NotificationComponent from '@/components/NotificationComponent.vue'
import VuePdfApp from 'vue3-pdf-app'
import mammoth from 'mammoth'

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

// Modal de previsualización
const showPreviewModal = ref(false)
const previewDocument = ref<{ id: number, name: string, category: string, extension: string } | null>(null)
const previewContent = ref('')
const previewType = ref<'pdf' | 'docx' | 'unsupported'>('pdf')
const previewLoading = ref(false)

// Modal de eliminación
const showDeleteModal = ref(false)
const fileToDelete = ref<{ id: number, name: string, category: string } | null>(null)

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
    console.log('Respuesta de descarga:', response)
    const blob = response instanceof Blob ? response : response
    if (blob instanceof Blob) {
      const url = window.URL.createObjectURL(blob)
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
  const doc = filteredDocuments.value.find(d => d.id === id)
  if (!doc) return

  DocumentService.downloadFileByName(doc.name, doc.category)
    .then(response => {
      const blob = response instanceof Blob ? response : response
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.name)
        document.body.appendChild(link)
        link.click()
        link.remove()
        showNotification.value = true
        notificationType.value = 'success'
        notificationMessage.value = `¡Descarga de "${doc.name}" iniciada!`
        setTimeout(() => { showNotification.value = false }, 4000)
      } else {
        showNotification.value = true
        notificationType.value = 'error'
        notificationMessage.value = 'La respuesta no es un archivo descargable.'
        setTimeout(() => { showNotification.value = false }, 4000)
      }
    })
    .catch(err => {
      console.error('Error al descargar archivo:', err)
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'Error al descargar el archivo'
      setTimeout(() => { showNotification.value = false }, 4000)
    })
}

async function viewDocument(id: number) {
  const doc = filteredDocuments.value.find(d => d.id === id)
  if (!doc) return

  const extension = doc.extension.toLowerCase()

  // Verificar si es un tipo de archivo soportado
  if (!['pdf', 'docx'].includes(extension)) {
    showNotification.value = true
    notificationType.value = 'warning'
    notificationMessage.value = `La previsualización no está disponible para archivos .${extension.toUpperCase()}`
    setTimeout(() => { showNotification.value = false }, 4000)
    return
  }

  previewDocument.value = doc
  previewType.value = extension as 'pdf' | 'docx'
  previewLoading.value = true
  showPreviewModal.value = true
  previewContent.value = ''

  try {
    // Descargar el archivo para previsualización
    const response = await DocumentService.downloadFileByName(doc.name, doc.category)
    const blob = response instanceof Blob ? response : response

    if (!(blob instanceof Blob)) {
      throw new Error('No se pudo obtener el archivo')
    }

    if (extension === 'pdf') {
      // Para PDF, crear URL del blob
      previewContent.value = window.URL.createObjectURL(blob)
    } else if (extension === 'docx') {
      // Para DOCX, convertir a HTML usando mammoth
      const arrayBuffer = await blob.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      previewContent.value = result.value
    }
  } catch (error) {
    console.error('Error al cargar el documento:', error)
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'Error al cargar la previsualización del documento'
    setTimeout(() => { showNotification.value = false }, 4000)
    closePreviewModal()
  } finally {
    previewLoading.value = false
  }
}

function closePreviewModal() {
  showPreviewModal.value = false
  previewDocument.value = null
  // Limpiar URL del blob para PDFs
  if (previewType.value === 'pdf' && previewContent.value) {
    window.URL.revokeObjectURL(previewContent.value)
  }
  previewContent.value = ''
  previewLoading.value = false
}

function deleteDocument(id: number) {
  const doc = filteredDocuments.value.find(d => d.id === id)
  if (!doc) return

  // Abrir modal de confirmación
  fileToDelete.value = doc
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  fileToDelete.value = null
}

function confirmDeleteDocument() {
  if (!fileToDelete.value) return

  const doc = fileToDelete.value

  // Buscar el documento real en el store para obtener su _id
  const realDoc = documentsStore.documents.find(d => d.filename === doc.name)
  if (!realDoc || !realDoc._id) {
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'No se pudo encontrar el ID del documento'
    setTimeout(() => { showNotification.value = false }, 4000)
    closeDeleteModal()
    return
  }

  DocumentService.deleteDocument(realDoc._id)
    .then(() => {
      showNotification.value = true
      notificationType.value = 'success'
      notificationMessage.value = `Documento "${doc.name}" eliminado correctamente`
      // Actualizar documentos
      documentsStore.fetchDocuments()
      setTimeout(() => { showNotification.value = false }, 4000)
      closeDeleteModal()
    })
    .catch(() => {
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'Error al eliminar el documento'
      setTimeout(() => { showNotification.value = false }, 4000)
      closeDeleteModal()
    })
}
</script>

<style scoped>
/* Estilos para el contenido DOCX */
.docx-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.docx-content :deep(h1),
.docx-content :deep(h2),
.docx-content :deep(h3),
.docx-content :deep(h4),
.docx-content :deep(h5),
.docx-content :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.docx-content :deep(ul),
.docx-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.docx-content :deep(li) {
  margin-bottom: 0.5rem;
}

.docx-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.docx-content :deep(td),
.docx-content :deep(th) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.docx-content :deep(th) {
  background-color: #f9fafb;
  font-weight: bold;
}

/* Dark mode styles for DOCX content */
.dark .docx-content :deep(td),
.dark .docx-content :deep(th) {
  border-color: #4b5563;
}

.dark .docx-content :deep(th) {
  background-color: #374151;
}
</style>
