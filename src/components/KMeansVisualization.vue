<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <BarChart3 class="w-5 h-5 mr-2 text-cyan-400" />
      Visualización de Clusters
    </h3>

    <!-- Placeholder for chart -->
    <div class="h-64 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
      <div class="text-center">
        <BarChart3 class="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p class="text-gray-400">Gráfico de K-Means</p>
        <p class="text-sm text-gray-500 mt-2">Los resultados aparecerán aquí después del análisis</p>
      </div>
    </div>

    <!-- Chart Legend -->
    <div v-if="results.length > 0" class="mt-4 grid grid-cols-2 gap-2">
      <div v-for="(cluster, index) in results" :key="index"
           class="flex items-center space-x-2 p-2 rounded-lg bg-white/5">
        <div :class="cluster.color" class="w-3 h-3 rounded-full"></div>
        <span class="text-sm text-gray-300">Grupo {{ index + 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
import type { KMeansCluster } from '@/types'

interface Props {
  results: KMeansCluster[]
}

defineProps<Props>()
</script>
