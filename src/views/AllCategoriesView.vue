<template>
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
      <h2 class="text-2xl font-bold mb-6 flex items-center">
        <FolderOpen class="w-6 h-6 mr-2 text-blue-400" />
        Todas las Categorías
        <span class="ml-2 text-blue-400 text-base font-normal">({{ categories.length }})</span>
      </h2>
      <div v-if="categories.length === 0"
        class="flex flex-col items-center justify-center gap-3 text-center py-10 px-4 rounded-xl border transition-all duration-300"
        :class="themeStore.dark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'">
        <FolderOpen class="w-10 h-10 text-blue-400 opacity-70" />
        <p class="text-base font-medium">No se encontraron categorías de archivos</p>
        <p class="text-sm opacity-70">Sube documentos para comenzar a organizarlos automáticamente.</p>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="category in categories" :key="category.id" @click="goToCategory(category.id)" :class="[
          'relative group cursor-pointer rounded-xl p-6 transition-all duration-300 hover:scale-105',
          themeStore.dark
            ? 'bg-white/5 hover:bg-white/10'
            : 'bg-gray-50 hover:bg-gray-100 border border-gray-300',
          selectedCategory === category.id ? 'ring-2 ring-blue-400' : ''
        ]">
          <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"
            :class="category.gradient"></div>
          <div class="relative flex flex-col items-center">
            <div :class="category.iconBg" class="w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <component :is="category.icon" class="w-6 h-6 text-white" />
            </div>
            <h4 :class="['font-medium text-base mb-1', themeStore.dark ? 'text-white' : 'text-gray-900']">
              {{ category.name }}
            </h4>
            <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
              {{ category.count }} docs
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/DashboardHeader.vue'
import { useThemeStore } from '@/stores/theme'
import { useCategoriesStore } from '@/stores/categories'
import { useDocumentsStore } from '@/stores/documents'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { FolderOpen } from 'lucide-vue-next'
import { randomInt } from '@/utils/fileUtils'

const themeStore = useThemeStore()
const categoriesStore = useCategoriesStore()
const documentsStore = useDocumentsStore()
const router = useRouter()

const selectedCategory = null

const iconList = [FolderOpen]
const gradientList = [
  { iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500', gradient: 'from-blue-500 to-indigo-500' },
  { iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500', gradient: 'from-green-500 to-emerald-500' },
  { iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500', gradient: 'from-purple-500 to-pink-500' },
  { iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500', gradient: 'from-yellow-500 to-orange-500' },
  { iconBg: 'bg-gradient-to-r from-cyan-500 to-blue-400', gradient: 'from-cyan-500 to-blue-400' },
  { iconBg: 'bg-gradient-to-r from-pink-500 to-red-500', gradient: 'from-pink-500 to-red-500' },
  { iconBg: 'bg-gradient-to-r from-gray-400 to-gray-600', gradient: 'from-gray-400 to-gray-600' },
]

const categories = computed(() => {
  const counts = documentsStore.documents.reduce<Record<string, number>>(
    (acc, doc) => {
      const cat = doc.categories?.[0] || 'Sin categoría'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    },
    {}
  )
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

function goToCategory(id: number) {
  router.push({ name: 'category-documents', params: { id } })
}

function goHome() {
  router.push('/')
}

const totalDocuments = computed(() => documentsStore.documents.length)
</script>
