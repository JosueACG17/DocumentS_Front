<template>
  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'
  ]">
    <h1 class="text-lg font-semibold text-white mb-4 flex items-center">
      <BarChart3 class="w-5 h-5 mr-2 text-cyan-400" />
      <span :class="themeStore.dark ? 'text-white' : 'text-gray-900'">Visualización de Clusters</span>
    </h1>

    <!-- Placeholder for chart -->
    <div :class="[
      'h-full rounded-xl flex items-center justify-center border transition-colors duration-300',
      themeStore.dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'
    ]">
      <!-- Loading state -->
      <div v-if="!graphData && results.length === 0" class="text-center p-20">
        <BarChart3 :class="themeStore.dark ? 'text-white' : 'text-gray-400'" class="w-30 h-30 mx-auto mb-4" />
        <p :class="themeStore.dark ? 'text-white' : 'text-gray-500'">Gráfico de K-Means</p>
        <p :class="['text-sm mt-2', themeStore.dark ? 'text-white' : 'text-gray-400']">Los resultados aparecerán aquí
          después del análisis</p>
      </div>

      <!-- Graph visualization -->
      <div v-else-if="graphData" class="max-w-full max-h-full p-2">
        <img :src="graphData" alt="Gráfico de Clusters K-Means" class="w-full h-full object-contain rounded-lg" />
      </div>

      <!-- Results available but no graph -->
      <div v-else class="text-center">
        <BarChart3 :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'" class="w-12 h-12 mx-auto mb-4" />
        <p :class="themeStore.dark ? 'text-white' : 'text-gray-700'" class="font-medium">Análisis Completado</p>
        <p :class="['text-sm mt-2', themeStore.dark ? 'text-gray-300' : 'text-gray-500']">
          {{ results.length }} grupos identificados
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'
import { BarChart3 } from 'lucide-vue-next'
import type { KMeansCluster } from '@/types'

interface Props {
  results: KMeansCluster[]
  graphData?: string | null
}

const themeStore = useThemeStore()
defineProps<Props>()
</script>
