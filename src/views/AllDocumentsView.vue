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
          <h2 :class="['text-2xl font-bold flex items-center', themeStore.dark ? 'text-white' : 'text-gray-900']">
            <FileText class="w-7 h-7 mr-2 text-green-400" />
            Todos los Documentos
          </h2>
        </div>
        <div class="flex items-center space-x-2">
          <button v-if="filteredDocuments.length > 0" @click="downloadAll" :class="[
            'p-3 rounded-lg flex items-center shadow-md cursor-pointer transition-colors',
            themeStore.dark ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
          ]">
            <Download class="w-5 h-5 mr-2" /> Descargar todo
          </button>
          <label :class="['text-sm', themeStore.dark ? 'text-white' : 'text-gray-900']">Filtrar por:</label>
          <select v-model="filter" :class="[
            'rounded-lg px-3 py-1 focus:outline-none transition-colors duration-300',
            themeStore.dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
          ]">
            <option value="" :class="themeStore.dark ? 'bg-black text-white' : 'bg-white text-gray-900'">Todos</option>
            <option value="pdf" :class="themeStore.dark ? 'bg-black text-white' : 'bg-white text-gray-900'">PDF</option>
            <option value="docx" :class="themeStore.dark ? 'bg-black text-white' : 'bg-white text-gray-900'">Word
            </option>
          </select>
        </div>
      </div>
      <div v-if="filteredDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in filteredDocuments" :key="doc.id" :class="[
          'group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-105 shadow-lg border',
          themeStore.dark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
        ]">
          <div class="flex items-center justify-between mb-3">
            <div :class="getFileIcon(doc.extension).bg"
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
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
          <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ doc.extension.toUpperCase() }} • {{ doc.size }} • {{ doc.category }}</p>
        </div>
      </div>
      <div v-else
        :class="['text-center py-24 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
        <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-16 h-16 mb-2" />
        <p class="text-lg">No hay documentos.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function downloadAll() {
  alert('Descargar todos los documentos')
}
import DashboardHeader from '@/components/DashboardHeader.vue'
import { FileText, Download, Eye, FileX } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { CATEGORIES_DATA } from '@/constants/mockData'
import type { Document } from '@/types'
import { useDocumentsStore } from '@/stores/documents'

import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()

const router = useRouter()
function goHome() {
  router.push('/')
}

const totalDocuments = CATEGORIES_DATA.reduce((acc, c) => acc + c.count, 0)

const documentsStore = useDocumentsStore()

// Mapea DocumentData a Document para la vista
const allDocuments = computed<Document[]>(() => {
  return documentsStore.documents.map((doc, idx) => ({
    id: idx + 1, // Si tienes un id real, úsalo aquí
    name: doc.filename,
    category: doc.categories[0] || 'Sin categoría',
    extension: doc.filename.split('.').pop() || '',
    size: doc.content ? `${(doc.content.length / 1024).toFixed(1)} KB` : '',
    date: '', // Si tienes fecha, mapea aquí
  }))
})

onMounted(() => {
  documentsStore.fetchDocuments()
})

const filter = ref('')
const filteredDocuments = computed(() => {
  if (!filter.value) return allDocuments.value
  return allDocuments.value.filter(doc => doc.extension === filter.value)
})

function downloadDocument(id: number) {
  alert('Descargar documento ' + id)
}
function viewDocument(id: number) {
  alert('Ver documento ' + id)
}
</script>
