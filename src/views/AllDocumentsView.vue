<template>
  <div class="min-h-screen bg-black">
    <DashboardHeader :total-documents="totalDocuments" />
    <div class="relative z-10 mx-auto px-6 py-8">
      <button @click="goHome"
        class="cursor-pointer mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium shadow transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Regresar</span>
      </button>
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-white flex items-center">
            <FileText class="w-7 h-7 mr-2 text-green-400" />
            Todos los Documentos
          </h2>
        </div>
        <div class="flex items-center space-x-2">
                    <button v-if="filteredDocuments.length > 0" @click="downloadAll"
            class="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 flex items-center shadow-md cursor-pointer">
            <Download class="w-5 h-5 mr-2" /> Descargar todo
          </button>
          <label class="text-white text-sm">Filtrar por:</label>
          <select v-model="filter" class="rounded-lg bg-white/10 text-white px-3 py-1 focus:outline-none">
            <option value="" class="bg-black">Todos</option>
            <option value="pdf" class="bg-black">PDF</option>
            <option value="docx" class="bg-black">Word</option>
          </select>
        </div>
      </div>
      <div v-if="filteredDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in filteredDocuments" :key="doc.id"
          class="group relative overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 p-5 transition-all duration-300 hover:scale-105 shadow-lg border border-white/10">
          <div class="flex items-center justify-between mb-3">
            <div :class="getFileIcon(doc.extension).bg" class="w-10 h-10 rounded-lg flex items-center justify-center">
              <component :is="getFileIcon(doc.extension).icon" class="w-5 h-5 text-white" />
            </div>
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="downloadDocument(doc.id)"
                class="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-md transition-colors cursor-pointer">
                <Download class="w-4 h-4 text-blue-400" />
              </button>
              <button @click="viewDocument(doc.id)"
                class="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-md transition-colors cursor-pointer">
                <Eye class="w-4 h-4 text-green-400" />
              </button>
            </div>
          </div>
          <h4 class="font-medium text-white text-base mb-1 truncate">{{ doc.name }}</h4>
          <p class="text-xs text-gray-400 mb-2">{{ doc.size }} • {{ doc.date }}</p>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 py-24 flex flex-col items-center justify-center space-y-4">
        <FileX class="w-16 h-16 text-gray-500 mb-2" />
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
import { ref, computed } from 'vue'
import { CATEGORIES_DATA } from '@/constants/mockData'
import type { Document } from '@/types'

const router = useRouter()
function goHome() {
  router.push('/')
}

const totalDocuments = CATEGORIES_DATA.reduce((acc, c) => acc + c.count, 0)

// Simulación de todos los documentos
const allDocuments = ref<Document[]>([
  { id: 1, name: 'Tesis Final.pdf', category: 'Académicos', extension: 'pdf', size: '2.1 MB', date: '2025-07-20' },
  { id: 2, name: 'Notas de Clase.docx', category: 'Académicos', extension: 'docx', size: '1.2 MB', date: '2025-07-18' },
  { id: 3, name: 'Resumen.xlsx', category: 'Académicos', extension: 'xlsx', size: '800 KB', date: '2025-07-15' },
  { id: 4, name: 'Contrato.pdf', category: 'Legales', extension: 'pdf', size: '1.5 MB', date: '2025-07-10' },
  { id: 5, name: 'Factura.docx', category: 'Financieros', extension: 'docx', size: '900 KB', date: '2025-07-08' },
  { id: 6, name: 'Manual.pdf', category: 'Técnicos', extension: 'pdf', size: '3.2 MB', date: '2025-07-05' },
])

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
