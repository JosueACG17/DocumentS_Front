<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-white flex items-center">
        <FileText class="w-5 h-5 mr-2 text-green-400" />
        Documentos Recientes
      </h3>
      <div class="flex items-center space-x-2">
        <button @click="$emit('update:viewMode', 'list')" :class="viewMode === 'list' ? 'bg-purple-500' : 'bg-white/10'"
          class="p-2 rounded-lg transition-colors cursor-pointer">
          <List class="w-4 h-4 text-white" />
        </button>
        <button @click="$emit('update:viewMode', 'grid')" :class="viewMode === 'grid' ? 'bg-purple-500' : 'bg-white/10'"
          class="p-2 rounded-lg transition-colors cursor-pointer">
          <Grid class="w-4 h-4 text-white" />
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="space-y-3">
      <template v-if="documents.length > 0">
        <div v-for="doc in documents" :key="doc.id"
          class="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group">
          <div class="flex items-center space-x-4">
            <div :class="getFileIcon(doc.extension).bg" class="w-10 h-10 rounded-lg flex items-center justify-center">
              <component :is="getFileIcon(doc.extension).icon" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 class="font-medium text-white">{{ doc.name }}</h4>
              <p class="text-sm text-gray-400">{{ doc.category }} • {{ doc.size }} • {{ doc.date }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="$emit('downloadDocument', doc.id)"
              class="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
              <Download class="w-4 h-4 text-blue-400 cursor-pointer" />
            </button>
            <button @click="$emit('viewDocument', doc.id)"
              class="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
              <Eye class="w-4 h-4 text-green-400 cursor-pointer" />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-center text-gray-400 py-12 flex flex-col items-center justify-center space-y-4">
          <FileX class="w-12 h-12 text-gray-500" />
          <p class="text-base">No se encontraron los documentos que buscas.</p>
        </div>
      </template>

    </div>

    <!-- Grid View -->
    <div v-else>
      <template v-if="documents.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="doc in documents" :key="doc.id"
            class="group relative overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 p-4 transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-3">
              <div :class="getFileIcon(doc.extension).bg" class="w-10 h-10 rounded-lg flex items-center justify-center">
                <component :is="getFileIcon(doc.extension).icon" class="w-5 h-5 text-white" />
              </div>
              <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="$emit('downloadDocument', doc.id)"
                  class="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-md transition-colors">
                  <Download class="w-3 h-3 text-blue-400 cursor-pointer" />
                </button>
                <button @click="$emit('viewDocument', doc.id)"
                  class="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-md transition-colors">
                  <Eye class="w-3 h-3 text-green-400 cursor-pointer" />
                </button>
              </div>
            </div>
            <h4 class="font-medium text-white text-sm mb-1 truncate">{{ doc.name }}</h4>
            <p class="text-xs text-gray-400 mb-2">{{ doc.category }}</p>
            <div class="flex justify-between text-xs text-gray-500">
              <span>{{ doc.size }}</span>
              <span>{{ doc.date }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="text-center text-gray-400 py-12 flex flex-col items-center justify-center space-y-4">
          <FileX class="w-12 h-12 text-gray-500" />
          <p class="text-sm">No hay documentos recientes.</p>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, List, Grid, Download, Eye, FileX } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import type { Document, ViewMode } from '@/types'

interface Props {
  documents: Document[]
  viewMode: ViewMode
}

interface Emits {
  (e: 'update:viewMode', mode: ViewMode): void
  (e: 'downloadDocument', docId: number): void
  (e: 'viewDocument', docId: number): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
