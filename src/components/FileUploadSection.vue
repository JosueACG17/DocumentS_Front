<template>
  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 h-full flex flex-col transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-300'
  ]">
    <h3 :class="['text-lg font-semibold mb-4 flex items-center', themeStore.dark ? 'text-white' : 'text-gray-900']">
      <Upload class="w-5 h-5 mr-2 text-purple-400" />
      Cargar Documento
    </h3>
    <div class="flex-1 flex flex-col">
      <div :class="[
        'border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 cursor-pointer group flex-1 flex flex-col justify-center',
        themeStore.dark ? 'border-white/30 hover:border-purple-400' : 'border-gray-300 hover:border-purple-400 bg-gray-50'
      ]" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
        <div
          class="w-16 h-16 bg-gradient-to-r from-purple-700 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <FileText class="w-8 h-8 text-white" />
        </div>
        <p :class="['font-medium mb-2', themeStore.dark ? 'text-white' : 'text-gray-900']">Arrastra tu archivo aquí</p>
        <p :class="['text-sm mb-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">o haz clic para seleccionar
        </p>
        <p :class="['text-xs', themeStore.dark ? 'text-gray-500' : 'text-gray-400']">Soporta PDF y DOCX</p>
        <input ref="fileInput" type="file" class="hidden" accept=".pdf,.docx" @change="handleFileUpload">
      </div>
      <!-- Upload Progress -->
      <div v-if="uploadProgress > 0" class="mt-4">
        <div :class="['flex justify-between text-sm mb-2', themeStore.dark ? 'text-gray-300' : 'text-gray-700']">
          <span>Subiendo...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div :class="themeStore.dark ? 'w-full bg-gray-700 rounded-full h-2' : 'w-full bg-gray-200 rounded-full h-2'">
          <div class="bg-gradient-to-r from-purple-700 to-cyan-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { Upload, FileText } from 'lucide-vue-next'
import { useFileUpload } from '@/composables/useFileUpdload'
import { DocumentService } from '@/services/DocumentService'
import { ref } from 'vue'
import { useDocumentsStore } from '@/stores/documents'

interface Emits {
  (e: 'fileUploaded', file: File): void
  (e: 'showNotification', type: string, message: string): void
}

const emit = defineEmits<Emits>()
const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()
const {
  uploadProgress,
  fileInput,
  triggerFileUpload,
  handleFileUpload: baseHandleFileUpload,
  handleFileDrop: baseHandleFileDrop
} = useFileUpload()

const isUploading = ref(false)

const checkDuplicate = (file: File) => {
  // Extrae nombre y extensión
  const fileName = file.name.split('.').slice(0, -1).join('.')
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  // Busca en los documentos existentes
  return documentsStore.documents.some(doc => {
    const docName = doc.filename.split('.').slice(0, -1).join('.')
    const docExt = doc.filename.split('.').pop()?.toLowerCase()
    return docName === fileName && docExt === fileExt
  })
}

const handleFileUpload = async (event: Event) => {
  baseHandleFileUpload(event, async (file) => {
    if (!file) return
    // Verifica duplicado
    if (checkDuplicate(file)) {
      emit('showNotification', 'warning', 'No puedes subir documentos que ya han sido subidos.')
      return
    }
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    try {
      await DocumentService.uploadDocument(formData)
      emit('showNotification', 'success', '¡Documento subido exitosamente!')
      emit('fileUploaded', file)
    } catch (err) {
      emit('showNotification', 'error', 'Error al subir el documento')
    } finally {
      isUploading.value = false
    }
  })
}

const handleFileDrop = async (event: DragEvent) => {
  baseHandleFileDrop(event, async (file) => {
    if (!file) return
    // Verifica duplicado
    if (checkDuplicate(file)) {
      emit('showNotification', 'warning', 'No puedes subir documentos que ya han sido subidos.')
      return
    }
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    try {
      await DocumentService.uploadDocument(formData)
      emit('showNotification', 'success', '¡Documento subido exitosamente!')
      emit('fileUploaded', file)
    } catch (err) {
      emit('showNotification', 'error', 'Error al subir el documento')
    } finally {
      isUploading.value = false
    }
  })
}
</script>
