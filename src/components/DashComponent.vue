<template>
  <div
    :class="['min-h-screen', themeStore.dark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900', 'transition-colors duration-300']">
    <!-- Header -->
    <DashboardHeader :total-documents="totalDocuments" />

    <div :class="['relative z-10 mx-auto px-6 py-8', themeStore.dark ? 'bg-neutral-900' : 'bg-white']">
      <!-- Stats Cards -->
      <StatsCards :stats="stats" />

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Upload & Categorías alineados -->
        <div class="col-span-1 lg:col-span-3 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUploadSection @file-uploaded="handleFileUploaded" />
            <CategoriesGrid :categories="categories" :selected-category="selectedCategory"
              :total-documents="totalDocuments" @category-selected="selectCategory" />
          </div>
        </div>

        <!-- Search & Documents: ancho completo -->
        <div class="col-span-1 lg:col-span-3 w-full">
          <SearchAndFilter v-model:search-query="searchQuery" v-model:filter-extension="filterExtension"
            @search="searchDocuments" class="w-full" />
          <DocumentsList :documents="filteredDocuments" v-model:view-mode="viewMode"
            @download-document="downloadDocument" @view-document="viewDocument" class="w-full" />
        </div>
      </div>

      <!-- K-Means Analysis Section -->
      <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <KMeansAnalysis :is-analyzing="isAnalyzing" :kmeans-status="kmeansStatus"
          :kmeans-status-color="kmeansStatusColor" :results="kmeansResults" @run-analysis="runKMeansAnalysis" />
        <KMeansVisualization :results="kmeansResults" />

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Components
import DashboardHeader from '@/components/DashboardHeader.vue'
import StatsCards from '@/components/StatsCards.vue'
import FileUploadSection from '@/components/FileUploadSection.vue'
import CategoriesGrid from '@/components/CategoriesGrid.vue'
import SearchAndFilter from '@/components/SearchAndFilter.vue'
import DocumentsList from '@/components/DocumentsList.vue'
import KMeansAnalysis from '@/components/KMeansAnalysis.vue'
import KMeansVisualization from '@/components/KMeansVisualization.vue'

// Composables
import { useDocuments } from '@/composables/useDocuments'
import { useKMeans } from '@/composables/useKMeans'
import { useSearch } from '@/composables/useSearch'

// Constants
import { STATS_DATA, CATEGORIES_DATA } from '@/constants/mockData'

// Types
import type { ViewMode } from '@/types'

// Data
const stats = ref(STATS_DATA)
const categories = ref(CATEGORIES_DATA)
const viewMode = ref<ViewMode>('list')

// Theme
const themeStore = useThemeStore()

// Composables
const { documents, addDocument, downloadDocument, viewDocument } = useDocuments()
const {
  isAnalyzing,
  kmeansStatus,
  kmeansResults,
  kmeansStatusColor,
  runKMeansAnalysis
} = useKMeans()
const {
  searchQuery,
  filterExtension,
  selectedCategory,
  filteredDocuments,
  searchDocuments,
  selectCategory
} = useSearch(documents, categories)

// Computed
const totalDocuments = computed(() => {
  return categories.value.reduce((total, cat) => total + cat.count, 0)
})

// Methods
const handleFileUploaded = (file: File) => {
  addDocument(file)
}

// Lifecycle
onMounted(() => {
  console.log('Dashboard mounted')
})
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
