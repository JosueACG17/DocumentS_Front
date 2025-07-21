<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <Brain class="w-5 h-5 mr-2 text-pink-400" />
      Análisis K-Means
    </h3>
    <p class="text-gray-400 text-sm mb-6">
      Agrupa automáticamente tus documentos en 4 categorías basándose en patrones de texto.
    </p>

    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 rounded-xl bg-white/5">
        <div>
          <h4 class="text-white font-medium">Estado del Análisis</h4>
          <p class="text-sm text-gray-400">{{ kmeansStatus }}</p>
        </div>
        <div class="w-3 h-3 rounded-full" :class="kmeansStatusColor"></div>
      </div>

      <button @click="$emit('runAnalysis')"
              :disabled="isAnalyzing"
              class="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-500 to-slate-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
        <component :is="isAnalyzing ? 'Loader' : 'Play'"
                   :class="isAnalyzing ? 'animate-spin' : ''"
                   class="w-4 h-4 mr-2" />
        {{ isAnalyzing ? 'Analizando...' : 'Ejecutar Análisis' }}
      </button>
    </div>

    <!-- K-Means Results -->
    <div v-if="results.length > 0" class="mt-6">
      <h4 class="text-white font-medium mb-4">Grupos Identificados</h4>
      <div class="space-y-3">
        <div v-for="(cluster, index) in results" :key="index"
             class="p-3 rounded-lg bg-white/5 border border-white/10">
          <div class="flex items-center justify-between mb-2">
            <span class="text-white font-medium">Grupo {{ index + 1 }}</span>
            <span class="text-sm text-gray-400">{{ cluster.count }} docs</span>
          </div>
          <p class="text-sm text-gray-300 mb-2">{{ cluster.description }}</p>
          <div class="flex flex-wrap gap-1">
            <span v-for="keyword in cluster.keywords" :key="keyword"
                  class="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
              {{ keyword }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Brain } from 'lucide-vue-next'
import type { KMeansCluster } from '@/types'

interface Props {
  isAnalyzing: boolean
  kmeansStatus: string
  kmeansStatusColor: string
  results: KMeansCluster[]
}

interface Emits {
  (e: 'runAnalysis'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
