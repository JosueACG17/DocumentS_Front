<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    themeStore.dark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
  ]">
    <!-- Notificación global -->
    <NotificationComponent v-if="showNotification" :type="notificationType" :message="notificationMessage"
      :duration="4000" class="fixed top-8 right-0 z-[9999] w-[420px] max-w-full"
      style="border-radius: 1.5rem 0 0 1.5rem;" />
    <!-- Header -->
    <DashboardHeader :total-documents="totalDocuments" />

    <!-- File Assistant Bot -->
    <FileAssistantBot :top-offset="80" @document-selected="handleDocumentSelected"
      @category-selected="handleCategorySelected" @show-notification="handleShowNotification"
      @show-all-files="handleShowAllFiles" @show-by-category="handleShowByCategory" />

    <div :class="[
      'relative z-10 mx-auto px-6 py-8',
      themeStore.dark ? 'bg-neutral-900' : 'bg-white'
    ]">

      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h1 :class="[
          'text-4xl font-bold mb-2',
          themeStore.dark ? 'text-white' : 'text-neutral-900'
        ]">¡Bienvenido de nuevo, {{ authStore.currentUser?.username }}!</h1>
      </div>

      <!-- Stats Cards -->
      <StatsCards :stats="computedStats" />

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Upload & Categorías alineados -->
        <div class="col-span-1 lg:col-span-3 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUploadSection class="w-full h-full" @file-uploaded="handleFileUploaded"
              @showNotification="handleShowNotification" />
            <CategoriesGrid class="w-full h-full" :categories="categories" :selected-category="selectedCategory"
              :total-documents="totalDocuments" />
          </div>
        </div>

        <!-- Search & Documents: ancho completo -->
        <div class="col-span-1 lg:col-span-3 w-full">
          <DocumentsList v-model:view-mode="viewMode" class="w-full" />
        </div>
      </div>

      <!-- K-Means Analysis Section -->
      <div class="mt-8 flex flex-col gap-8">
        <KMeansAnalysis :is-analyzing="isAnalyzing" :kmeans-status="kmeansStatus"
          :kmeans-status-color="kmeansStatusColor" :results="kmeansResults" @run-analysis="handleRunAnalysis" />
        <KMeansVisualization :results="kmeansResults" :graph-data="graphData" :clear-graph-data="clearGraphData" />
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
            <div :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center text-white',
              previewDocument?.filename.toLowerCase().endsWith('.pdf')
                ? 'bg-gradient-to-r from-red-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            ]">
              <FileType v-if="previewDocument?.filename.toLowerCase().endsWith('.pdf')" class="w-6 h-6" />
              <FileText v-else class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ previewDocument?.filename || 'Documento' }}</h3>
              <p class="text-sm opacity-70">Previsualización del documento</p>
            </div>
          </div>
          <button @click="closePreviewModal" :class="[
            themeStore.dark
              ? 'hover:bg-neutral-700 text-neutral-300'
              : 'hover:bg-gray-100 text-gray-500',
            'p-2 rounded-full transition-colors cursor-pointer'
          ]">
            <X class="w-6 h-6" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useDocumentsStore } from '@/stores/documents'
import { useCategoriesStore } from '@/stores/categories'
import { randomInt } from '@/utils/fileUtils'
import type { ViewMode } from '@/types'
import { useRouter } from 'vue-router'
import { DocumentService } from '@/services/DocumentService'
import mammoth from 'mammoth'
import VuePdfApp from 'vue3-pdf-app'
import { useAuthStore } from '@/stores/auth'


// Components
import DashboardHeader from '@/components/DashboardHeader.vue'
import StatsCards from '@/components/StatsCards.vue'
import FileUploadSection from '@/components/FileUploadSection.vue'
import CategoriesGrid from '@/components/CategoriesGrid.vue'
import DocumentsList from '@/components/DocumentsList.vue'
import KMeansAnalysis from '@/components/KMeansAnalysis.vue'
import KMeansVisualization from '@/components/KMeansVisualization.vue'
import NotificationComponent from '@/components/NotificationComponent.vue'
import FileAssistantBot from '@/components/FileAssistantBot.vue'

// Composables
import { useDocuments } from '@/composables/useDocuments'
import { useKMeans } from '@/composables/useKMeans'

// Icons (para categorías, el que uses)
import { BookOpen, Folder, Brain, Target, FileText, X, FileX, FileType } from 'lucide-vue-next'

// Theme
const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()

const { addDocument } = useDocuments()
const {
  isAnalyzing,
  kmeansStatus,
  kmeansResults,
  kmeansStatusColor,
  graphData,
  runKMeansAnalysis,
  clearGraphData,
} = useKMeans()

const viewMode = ref<ViewMode>('list')
const selectedCategory = ref<number>(0)
const showNotification = ref(false)
const notificationType = ref<'success' | 'error' | 'info' | 'warning'>('success')
const notificationMessage = ref('')

// Variables para previsualización de documentos
const showPreviewModal = ref(false)
const previewDocument = ref<import('@/types/apiresponse').DocumentData | null>(null)
const previewContent = ref('')
const previewType = ref<'pdf' | 'docx' | 'unsupported'>('pdf')
const previewLoading = ref(false)

// Router para navegación
const router = useRouter()

// Carga documentos cuando monte el componente
onMounted(() => {
  documentsStore.fetchDocuments()
  categoriesStore.fetchCategories()
})

// Total documentos basado en la cantidad real de documentos cargados
const totalDocuments = computed(() => documentsStore.documents.length)
const totalCategories = computed(() => categoriesStore.categories.length)

const iconList = [BookOpen, Folder, Brain, Target]
const gradientList = [
  { iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500', gradient: 'from-blue-500 to-indigo-500', progressColor: 'bg-blue-500' },
  { iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500', gradient: 'from-green-500 to-emerald-500', progressColor: 'bg-green-500' },
  { iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500', gradient: 'from-purple-500 to-pink-500', progressColor: 'bg-purple-500' },
  { iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500', gradient: 'from-yellow-500 to-orange-500', progressColor: 'bg-yellow-500' },
  { iconBg: 'bg-gradient-to-r from-cyan-500 to-blue-400', gradient: 'from-cyan-500 to-blue-400', progressColor: 'bg-cyan-500' },
  { iconBg: 'bg-gradient-to-r from-pink-500 to-red-500', gradient: 'from-pink-500 to-red-500', progressColor: 'bg-pink-500' },
  { iconBg: 'bg-gradient-to-r from-gray-400 to-gray-600', gradient: 'from-gray-400 to-gray-600', progressColor: 'bg-gray-400' },
]

// Categorías con conteo real basado en documentos cargados
const categories = computed(() => {
  // Cuenta documentos por categoría
  const counts = documentsStore.documents.reduce<Record<string, number>>(
    (acc, doc) => {
      const cat = doc.categories?.[0] || 'Sin categoría'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    },
    {}
  )
  // Mapea las categorías del store, asignando icono y gradient aleatorio
  return categoriesStore.categories.map((name, idx) => {
    const count = counts[name] || 0
    const icon = iconList[randomInt(0, iconList.length - 1)]
    const colors = gradientList[randomInt(0, gradientList.length - 1)]
    return {
      id: idx + 1,
      name,
      count,
      icon,
      ...colors,
    }
  })
})

// Actualiza categorías al subir archivo y refresca el store
const handleFileUploaded = async (file: File) => {
  addDocument(file)
  await documentsStore.fetchDocuments()
}

// Muestra la notificación global
function handleShowNotification(type: string, message: string) {
  notificationType.value = type as 'success' | 'error' | 'info' | 'warning'
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => { showNotification.value = false }, 4000)
}

// Notificación al ejecutar análisis
function handleRunAnalysis() {
  showNotification.value = true
  runKMeansAnalysis()
  setTimeout(() => { showNotification.value = false }, 2000)
}

// Handlers para el FileAssistantBot
async function handleDocumentSelected(document: import('@/types/apiresponse').DocumentData) {
  const extension = document.filename.split('.').pop()?.toLowerCase() || ''

  // Verificar si es un tipo de archivo soportado
  if (!['pdf', 'docx'].includes(extension)) {
    handleShowNotification('warning', `La previsualización no está disponible para archivos .${extension.toUpperCase()}`)
    return
  }

  previewDocument.value = document
  previewType.value = extension as 'pdf' | 'docx'
  previewLoading.value = true
  showPreviewModal.value = true
  previewContent.value = ''

  try {
    // Obtener la categoría del documento para la descarga
    const category = document.categories?.[0] || 'Sin categoría'

    // Descargar el archivo para previsualización
    const response = await DocumentService.downloadFileByName(document.filename, category)
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
    handleShowNotification('error', 'Error al cargar la previsualización del documento')
    closePreviewModal()
  } finally {
    previewLoading.value = false
  }
}

function handleCategorySelected(categoryName: string) {
  // Buscar el ID de la categoría basado en el nombre
  const categoryIndex = categoriesStore.categories.findIndex(cat => cat === categoryName)
  if (categoryIndex !== -1) {
    const categoryId = categoryIndex + 1
    router.push({ name: 'category-documents', params: { id: categoryId.toString() } })
  }
}

function handleShowAllFiles() {
  router.push({ name: 'all-documents' })
}

function handleShowByCategory() {
  router.push({ name: 'all-categories' })
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

const computedStats = computed(() => [
  {
    label: 'Total Documentos',
    value: totalDocuments.value.toString(),
    change: '+12%',
    trend: 'up' as const,
    icon: BookOpen,
    iconBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Categorías Activas',
    value: totalCategories.value.toString(),
    change: '+5%',
    trend: 'up' as const,
    icon: Folder,
    iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Análisis K-Means',
    value: '4',
    change: '+8%',
    trend: 'up' as const,
    icon: Brain,
    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Precisión IA',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up' as const,
    icon: Target,
    iconBg: 'bg-gradient-to-r from-orange-500 to-red-500',
    gradient: 'from-orange-500 to-red-500',
  },
])
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(167, 159, 173, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(167, 159, 173, 0.5);
}

/* Glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Smooth transitions */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

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
