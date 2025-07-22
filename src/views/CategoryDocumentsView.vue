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
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <div v-if="category" class="w-10 h-10 rounded-xl flex items-center justify-center" :class="category.iconBg">
            <component :is="category.icon" class="w-6 h-6 text-white" />
          </div>
          <div v-else class="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-700">
            <span class="text-white">?</span>
          </div>
          <div>
            <h2 :class="['text-2xl font-bold', themeStore.dark ? 'text-white' : 'text-gray-900']">{{ category ?
              category.name : 'Categoría' }}</h2>
            <p :class="['text-sm', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">Documentos de la categoría</p>
          </div>
        </div>
        <button :class="[
          'p-3 rounded-lg flex items-center shadow-md cursor-pointer transition-colors',
          themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
        ]" @click="downloadAll" v-if="documents && documents.length > 0">
          <Download class="w-5 h-5 mr-2" /> Descargar todo
        </button>
      </div>
      <div v-if="documents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in documents" :key="doc.id" :class="[
          'group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-105 shadow-lg border',
          themeStore.dark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
        ]">
          <div class="flex items-center justify-between mb-3">
            <div :class="getFileIcon(doc.extension).bg" class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
              <component :is="getFileIcon(doc.extension).icon" />
            </div>
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="downloadDocument(doc.id)"
                :class="[themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200', 'p-1.5 rounded-md transition-colors cursor-pointer']">
                <Download :class="themeStore.dark ? 'text-blue-400' : 'text-blue-600'" class="w-4 h-4" />
              </button>
              <button @click="viewDocument(doc.id)"
                :class="[themeStore.dark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200', 'p-1.5 rounded-md transition-colors cursor-pointer']">
                <Eye :class="themeStore.dark ? 'text-green-400' : 'text-green-600'" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <h4 :class="['font-medium text-base mb-1 truncate', themeStore.dark ? 'text-white' : 'text-gray-900']">{{
            doc.name }}</h4>
          <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ doc.size }} • {{ doc.date
            }}</p>
        </div>
      </div>
      <div v-else
        :class="['text-center py-24 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
        <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-16 h-16 mb-2" />
        <p class="text-lg">No hay documentos en esta categoría.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
  router.push('/')
}
import DashboardHeader from '@/components/DashboardHeader.vue'
import { Download, Eye, FileX } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { CATEGORIES_DATA } from '@/constants/mockData'
import type { Document } from '@/types'

import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()

// Simulación de datos (reemplazar por fetch real en el futuro)
const route = useRoute()
const categoryId = Number(route.params.id)
const category = CATEGORIES_DATA.find(c => c.id === categoryId)
const totalDocuments = CATEGORIES_DATA.reduce((acc, c) => acc + c.count, 0)

// Aquí podrías cargar los documentos de la categoría usando categoryId
// Por ahora, simulado:
const documents = ref<Document[]>([
  { id: 1, name: 'Tesis Final.pdf', category: category?.name || '', extension: 'pdf', size: '2.1 MB', date: '2025-07-20' },
  { id: 2, name: 'Notas de Clase.docx', category: category?.name || '', extension: 'docx', size: '1.2 MB', date: '2025-07-18' },
  { id: 3, name: 'Resumen.xlsx', category: category?.name || '', extension: 'xlsx', size: '800 KB', date: '2025-07-15' },
])

function downloadDocument(id: number) {
  // Lógica de descarga individual (placeholder)
  alert('Descargar documento ' + id)
}
function viewDocument(id: number) {
  // Lógica de ver documento (placeholder)
  alert('Ver documento ' + id)
}
function downloadAll() {
  // Lógica de descarga masiva (placeholder)
  alert('Descargar todos los documentos de la categoría')
}
</script>
