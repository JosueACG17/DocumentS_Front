<template>
  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 mb-6 transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'
  ]">
    <div class="flex items-center justify-between mb-6">
      <h3 :class="['text-lg font-semibold flex items-center', themeStore.dark ? 'text-white' : 'text-gray-900']">
        <FolderOpen class="w-5 h-5 mr-2 text-blue-400" />
        Categorías de Documentos
      </h3>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="category in categories" :key="category.id" @click="goToCategory(category.id)" :class="[
        'relative group cursor-pointer rounded-xl p-4 transition-all duration-300 hover:scale-105',
        themeStore.dark
          ? 'bg-white/5 hover:bg-white/10'
          : 'bg-gray-50 hover:bg-gray-100 border border-gray-300',
        selectedCategory === category.id ? 'ring-2 ring-blue-400' : ''
      ]">
        <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"
          :class="category.gradient"></div>
        <div class="relative">
          <div :class="category.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <component :is="category.icon" :class="themeStore.dark ? 'text-white' : 'text-gray-800'" class="w-5 h-5" />
          </div>
          <h4 :class="['font-medium text-sm mb-1', themeStore.dark ? 'text-white' : 'text-gray-900']">{{ category.name
            }}</h4>
          <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ category.count }} docs
          </p>
          <div :class="themeStore.dark ? 'w-full bg-gray-700 rounded-full h-1' : 'w-full bg-gray-200 rounded-full h-1'">
            <div :class="category.progressColor" class="h-1 rounded-full transition-all duration-500"
              :style="{ width: (category.count / totalDocuments * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

import { FolderOpen } from 'lucide-vue-next'
import type { Category } from '@/types'

import { useRouter } from 'vue-router'

interface Props {
  categories: Category[]
  selectedCategory: number | null
  totalDocuments: number
}

interface Emits {
  (e: 'categorySelected', categoryId: number): void
}

defineProps<Props>()
defineEmits<Emits>()

const router = useRouter()
const themeStore = useThemeStore()
function goToCategory(id: number) {
  router.push({ name: 'category-documents', params: { id } })
}
</script>
