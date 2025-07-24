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

    <div :class="[
      'relative z-10 mx-auto px-6 py-8',
      themeStore.dark ? 'bg-neutral-900' : 'bg-white'
    ]">
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
          <DocumentsList v-model:view-mode="viewMode" @download-document="downloadDocument"
            @view-document="viewDocument" class="w-full" />
        </div>
      </div>

      <!-- K-Means Analysis Section -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KMeansAnalysis :is-analyzing="isAnalyzing" :kmeans-status="kmeansStatus"
          :kmeans-status-color="kmeansStatusColor" :results="kmeansResults" @run-analysis="handleRunAnalysis" />
        <KMeansVisualization :results="kmeansResults" />
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

// Components
import DashboardHeader from '@/components/DashboardHeader.vue'
import StatsCards from '@/components/StatsCards.vue'
import FileUploadSection from '@/components/FileUploadSection.vue'
import CategoriesGrid from '@/components/CategoriesGrid.vue'
import DocumentsList from '@/components/DocumentsList.vue'
import KMeansAnalysis from '@/components/KMeansAnalysis.vue'
import KMeansVisualization from '@/components/KMeansVisualization.vue'
import NotificationComponent from '@/components/NotificationComponent.vue'

// Composables
import { useDocuments } from '@/composables/useDocuments'
import { useKMeans } from '@/composables/useKMeans'

// Icons (para categorías, el que uses)
import { BookOpen, Folder, Brain, Target } from 'lucide-vue-next'

// Theme
const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()
const categoriesStore = useCategoriesStore()

const { addDocument, downloadDocument, viewDocument } = useDocuments()
const {
  isAnalyzing,
  kmeansStatus,
  kmeansResults,
  kmeansStatusColor,
  runKMeansAnalysis,
} = useKMeans()

const viewMode = ref('list')
const selectedCategory = ref('')
const showNotification = ref(false)
const notificationType = ref<'success' | 'error' | 'info' | 'warning'>('success')
const notificationMessage = ref('')

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
  notificationType.value = type as any
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

const computedStats = computed(() => [
  {
    label: 'Total Documentos',
    value: totalDocuments.value.toString(),
    icon: BookOpen,
    iconBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Categorías Activas',
    value: totalCategories.value.toString(),
    icon: Folder,
    iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    label: 'Análisis K-Means',
    value: '4',
    icon: Brain,
    iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Precisión IA',
    value: '94.2%',
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
  background: rgba(147, 51, 234, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.7);
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
</style>
