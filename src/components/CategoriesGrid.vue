<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white flex items-center">
        <FolderOpen class="w-5 h-5 mr-2 text-blue-400" />
        Categorías de Documentos
      </h3>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="category in categories" :key="category.id"
           @click="$emit('categorySelected', category.id)"
           :class="selectedCategory === category.id ? 'ring-2 ring-purple-400' : ''"
           class="relative group cursor-pointer rounded-xl bg-white/5 hover:bg-white/10 p-4 transition-all duration-300 hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"
             :class="category.gradient"></div>
        <div class="relative">
          <div :class="category.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
            <component :is="category.icon" class="w-5 h-5 text-white" />
          </div>
          <h4 class="font-medium text-white text-sm mb-1">{{ category.name }}</h4>
          <p class="text-xs text-gray-400 mb-2">{{ category.count }} docs</p>
          <div class="w-full bg-gray-700 rounded-full h-1">
            <div :class="category.progressColor"
                 class="h-1 rounded-full transition-all duration-500"
                 :style="{ width: (category.count / totalDocuments * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next'
import type { Category } from '@/types'

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
</script>
