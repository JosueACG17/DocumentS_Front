<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 h-full flex flex-col">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <Upload class="w-5 h-5 mr-2 text-purple-400" />
      Cargar Documento
    </h3>
    <div class="flex-1 flex flex-col">
      <div
        class="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-purple-400 transition-colors duration-300 cursor-pointer group flex-1 flex flex-col justify-center"
        @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
        <div
          class="w-16 h-16 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <FileText class="w-8 h-8 text-white" />
        </div>
        <p class="text-white font-medium mb-2">Arrastra tu archivo aquí</p>
        <p class="text-gray-400 text-sm mb-4">o haz clic para seleccionar</p>
        <p class="text-xs text-gray-500">Soporta PDF y DOCX</p>
        <input ref="fileInput" type="file" class="hidden" accept=".pdf,.docx" @change="handleFileUpload">
      </div>
      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0" class="mt-4">
        <div class="flex justify-between text-sm text-gray-300 mb-2">
          <span>Subiendo...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div class="bg-gradient-to-r from-purple-700 to-cyan-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, FileText } from 'lucide-vue-next'
import { useFileUpload } from '@/composables/useFileUpdload'

interface Emits {
  (e: 'fileUploaded', file: File): void
}

const emit = defineEmits<Emits>()

const {
  uploadProgress,
  fileInput,
  triggerFileUpload,
  handleFileUpload: baseHandleFileUpload,
  handleFileDrop: baseHandleFileDrop
} = useFileUpload()

const handleFileUpload = (event: Event) => {
  baseHandleFileUpload(event, (file) => emit('fileUploaded', file))
}

const handleFileDrop = (event: DragEvent) => {
  baseHandleFileDrop(event, (file) => emit('fileUploaded', file))
}
</script>
