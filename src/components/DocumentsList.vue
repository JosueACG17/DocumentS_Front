<template>
  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'
  ]">
    <div class="flex items-center justify-between mb-6">
      <h3 :class="['text-lg font-semibold flex items-center', themeStore.dark ? 'text-white' : 'text-gray-900']">
        <FileText class="w-5 h-5 mr-2 text-green-400" />
        Documentos Recientes
      </h3>
      <div class="flex items-center space-x-2">
        <router-link to="/todos"
          :class="['hover:underline text-sm font-medium flex items-center space-x-1 cursor-pointer', themeStore.dark ? 'text-blue-400' : 'text-blue-600']">
          <span>Ver todos los documentos</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
        <button @click="$emit('update:viewMode', 'list')"
          :class="[viewMode === 'list' ? 'bg-purple-500' : (themeStore.dark ? 'bg-white/10' : 'bg-gray-100'), 'p-2 rounded-lg transition-colors cursor-pointer']">
          <List :class="themeStore.dark ? 'text-white' : 'text-gray-800'" class="w-4 h-4" />
        </button>
        <button @click="$emit('update:viewMode', 'grid')"
          :class="[viewMode === 'grid' ? 'bg-purple-500' : (themeStore.dark ? 'bg-white/10' : 'bg-gray-100'), 'p-2 rounded-lg transition-colors cursor-pointer']">
          <Grid :class="themeStore.dark ? 'text-white' : 'text-gray-800'" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="space-y-3">
      <template v-if="lastDocuments.length > 0">
        <div v-for="doc in lastDocuments" :key="doc.id" :class="[
          'flex items-center justify-between p-4 rounded-xl transition-all duration-200 group',
          themeStore.dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
        ]">
          <div class="flex items-center space-x-4">
            <div :class="getFileIcon(doc.extension).bg" class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
              <component :is="getFileIcon(doc.extension).icon"
                class="w-5 h-5" />
            </div>
            <div>
              <h4 :class="['font-medium', themeStore.dark ? 'text-white' : 'text-gray-900']">{{ doc.name }}</h4>
              <p :class="['text-sm', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ doc.category }} • {{
                doc.size }} • {{ doc.date }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="$emit('downloadDocument', doc.id)"
              :class="[themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200', 'p-2 rounded-lg transition-colors']">
              <Download :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'" class="w-4 h-4 cursor-pointer" />
            </button>
            <button @click="$emit('viewDocument', doc.id)"
              :class="[themeStore.dark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200', 'p-2 rounded-lg transition-colors']">
              <Eye :class="themeStore.dark ? 'text-green-400' : 'text-green-600'" class="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          :class="['text-center py-12 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
          <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-12 h-12" />
          <p class="text-base">No se encontraron los documentos que buscas.</p>
        </div>
      </template>

    </div>

    <!-- Grid View -->
    <div v-else>
      <template v-if="lastDocuments.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="doc in lastDocuments" :key="doc.id" :class="[
            'group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105',
            themeStore.dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-300'
          ]">
            <div class="flex items-center justify-between mb-3">
              <div :class="getFileIcon(doc.extension).bg" class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
                <component :is="getFileIcon(doc.extension).icon" />
              </div>
              <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="$emit('downloadDocument', doc.id)"
                  :class="[themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200', 'p-1.5 rounded-md transition-colors']">
                  <Download :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'"
                    class="w-3 h-3 cursor-pointer" />
                </button>
                <button @click="$emit('viewDocument', doc.id)"
                  :class="[themeStore.dark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200', 'p-1.5 rounded-md transition-colors']">
                  <Eye :class="themeStore.dark ? 'text-green-400' : 'text-green-600'" class="w-3 h-3 cursor-pointer" />
                </button>
              </div>
            </div>
            <h4 :class="['font-medium text-sm mb-1 truncate', themeStore.dark ? 'text-white' : 'text-gray-900']">{{
              doc.name }}</h4>
            <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ doc.category }}</p>
            <div :class="['flex justify-between text-xs', themeStore.dark ? 'text-gray-500' : 'text-gray-400']">
              <span>{{ doc.size }}</span>
              <span>{{ doc.date }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          :class="['text-center py-12 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
          <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-12 h-12" />
          <p class="text-sm">No hay documentos recientes.</p>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'
import { FileText, List, Grid, Download, Eye, FileX } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import { computed } from 'vue'
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

const props = defineProps<Props>()
defineEmits<Emits>()

const themeStore = useThemeStore()
const lastDocuments = computed(() => props.documents.slice(0, 6))
</script>
