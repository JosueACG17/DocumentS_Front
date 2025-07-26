<template>
  <!-- Notificaciones -->
  <NotificationComponent v-if="showNotification" :type="notificationType" :message="notificationMessage"
    :duration="4000" class="fixed top-21 right-0 z-[99999] w-[420px] max-w-full"
    style="border-radius: 1.5rem 0 0 1.5rem;" />

  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'
  ]">
    <div class="flex items-center justify-between mb-6">
      <h3 :class="['text-lg font-semibold flex items-center', themeStore.dark ? 'text-white' : 'text-gray-900']">
        <FileText class="w-5 h-5 mr-2 text-green-400" />
        Documentos Recientes
      </h3>
      <div class="flex items-center space-x-2">
        <router-link to="/todos"
          :class="['hover:underline text-sm font-medium flex items-center space-x-1 cursor-pointer', themeStore.dark ? 'text-blue-400' : 'text-blue-600']">
          <span>Ver todos los documentos</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
        <button @click="$emit('update:viewMode', 'list')"
          :class="[viewMode === 'list' ? 'bg-purple-500' : (themeStore.dark ? 'bg-white/10' : 'bg-gray-100'), 'p-2 rounded-lg transition-colors cursor-pointer']">
          <List :class="themeStore.dark ? 'text-white' : 'text-gray-800'" class="w-4 h-4" />
        </button>
        <button @click="$emit('update:viewMode', 'grid')"
          :class="[viewMode === 'grid' ? 'bg-purple-500' : (themeStore.dark ? 'bg-white/10' : 'bg-gray-100'), 'p-2 rounded-lg transition-colors cursor-pointer']">
          <Grid :class="themeStore.dark ? 'text-white' : 'text-gray-800'" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="space-y-3">
      <template v-if="lastDocuments.length > 0">
        <div v-for="doc in lastDocuments" :key="doc.id" :class="[
          'flex items-center justify-between p-4 rounded-xl transition-all duration-200 group',
          themeStore.dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
        ]">
          <div class="flex items-center space-x-4">
            <div :class="getFileIcon(doc.extension).bg"
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
              <component :is="getFileIcon(doc.extension).icon" class="w-5 h-5" />
            </div>
            <div>
              <h4 :class="['font-medium', themeStore.dark ? 'text-white' : 'text-gray-900']">{{ doc.name }}</h4>
              <p :class="['text-sm', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ doc.category }} • {{
                doc.size }} • {{ doc.extension.toUpperCase() }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="downloadDocument(doc.id)"
              :class="[themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200', 'p-2 rounded-lg transition-colors']">
              <Download :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'" class="w-4 h-4 cursor-pointer" />
            </button>
            <button @click="viewDocument(doc.id)"
              :class="[themeStore.dark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200', 'p-2 rounded-lg transition-colors']">
              <Eye :class="themeStore.dark ? 'text-green-400' : 'text-green-600'" class="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          :class="['text-center py-12 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
          <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-12 h-12" />
          <p class="text-base">No se encontraron los documentos que buscas.</p>
        </div>
      </template>

    </div>

    <!-- Grid View -->
    <div v-else>
      <template v-if="lastDocuments.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="doc in lastDocuments" :key="doc.id" :class="[
            'group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105',
            themeStore.dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
          ]">
            <div class="flex items-center justify-between mb-3">
              <div :class="getFileIcon(doc.extension).bg"
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
                <component :is="getFileIcon(doc.extension).icon" />
              </div>
              <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="downloadDocument(doc.id)"
                  :class="[themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200', 'p-1.5 rounded-md transition-colors']">
                  <Download :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'"
                    class="w-3 h-3 cursor-pointer" />
                </button>
                <button @click="viewDocument(doc.id)"
                  :class="[themeStore.dark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200', 'p-1.5 rounded-md transition-colors']">
                  <Eye :class="themeStore.dark ? 'text-green-400' : 'text-green-600'" class="w-3 h-3 cursor-pointer" />
                </button>
              </div>
            </div>
            <h4 :class="['font-medium text-sm mb-1 truncate', themeStore.dark ? 'text-white' : 'text-gray-900']">{{
              doc.name }}</h4>
            <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ doc.category }}</p>
            <div :class="['flex justify-between text-xs', themeStore.dark ? 'text-gray-500' : 'text-gray-400']">
              <span>{{ doc.size }} • {{ doc.extension.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          :class="['text-center py-12 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
          <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-12 h-12" />
          <p class="text-sm">No hay documentos recientes.</p>
        </div>
      </template>

    </div>

    <!-- Modal de Previsualización de Documentos -->
    <Teleport to="body">
      <div v-if="showPreviewModal"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        style="z-index: 99999;">
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
    </Teleport>
  </div>
</template>

<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'
import { FileText, List, Grid, Download, Eye, FileX } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'

import { computed, onMounted, ref } from 'vue'
import { useDocumentsStore } from '@/stores/documents'
import type { ViewMode } from '@/types'
import { DocumentService } from '@/services/DocumentService'
import VuePdfApp from 'vue3-pdf-app'
import mammoth from 'mammoth'
import NotificationComponent from '@/components/NotificationComponent.vue'

interface Props {
  viewMode: ViewMode
}

defineProps<Props>()

const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()

// Modal de previsualización
const showPreviewModal = ref(false)
const previewDocument = ref<{ id: number, name: string, category: string, extension: string } | null>(null)
const previewContent = ref('')
const previewType = ref<'pdf' | 'docx' | 'unsupported'>('pdf')
const previewLoading = ref(false)

// Notificaciones
const showNotification = ref(false)
const notificationType = ref<'success' | 'error' | 'info' | 'warning'>('success')
const notificationMessage = ref('')

const lastDocuments = computed(() => {
  return documentsStore.documents.slice(-6).reverse().map((doc, idx) => ({
    id: idx + 1,
    name: doc.filename,
    category: doc.categories[0] || 'Sin categoría',
    extension: doc.filename.split('.').pop() || '',
    size: doc.content ? `${(doc.content.length / 1024).toFixed(1)} KB` : '',
    date: '',
  }))
})

// Función para descargar documento
function downloadDocument(id: number) {
  const doc = lastDocuments.value.find(d => d.id === id)
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

// Función para ver documento
async function viewDocument(id: number) {
  const doc = lastDocuments.value.find(d => d.id === id)
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

onMounted(() => {
  if (documentsStore.documents.length === 0) {
    documentsStore.fetchDocuments()
  }
})
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
