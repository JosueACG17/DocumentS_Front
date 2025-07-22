<template>
  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'
  ]">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <BarChart3 class="w-5 h-5 mr-2 text-cyan-400" />
      <span :class="themeStore.dark ? 'text-white' : 'text-gray-900'">Visualización de Clusters</span>
    </h3>

    <!-- Placeholder for chart -->
    <div :class="[
      'h-64 rounded-xl flex items-center justify-center border transition-colors duration-300',
      themeStore.dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-300'
    ]">
      <div class="text-center">
        <BarChart3 :class="themeStore.dark ? 'text-white' : 'text-gray-400'" class="w-12 h-12 mx-auto mb-4" />
        <p :class="themeStore.dark ? 'text-white' : 'text-gray-500'">Gráfico de K-Means</p>
        <p :class="['text-sm mt-2', themeStore.dark ? 'text-white' : 'text-gray-400']">Los resultados aparecerán aquí
          después del análisis</p>
      </div>
    </div>

    <!-- Chart Legend -->
    <div v-if="results.length > 0" class="mt-4 grid grid-cols-2 gap-2">
      <div v-for="(cluster, index) in results" :key="index" :class="[
        'flex items-center space-x-2 p-2 rounded-lg',
        themeStore.dark ? 'bg-white/5' : 'bg-gray-100'
      ]">
        <div :class="cluster.color" class="w-3 h-3 rounded-full"></div>
        <span :class="themeStore.dark ? 'text-sm text-gray-300' : 'text-sm text-gray-700'">Grupo {{ index + 1 }}</span>
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
}

const themeStore = useThemeStore()
defineProps<Props>()
</script>
