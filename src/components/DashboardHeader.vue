<template>
  <header class="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
    <div class="mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <FileText class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Documents Sort
            </h1>
            <p class="text-sm text-gray-400">Organizador Inteligente de Documentos</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm text-gray-300">{{ totalDocuments }} documentos</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'

interface Props {
  totalDocuments: number
}

defineProps<Props>()
</script>
