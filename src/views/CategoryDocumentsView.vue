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
            <!-- Textos de entrenamiento de la categoría -->
            <div v-if="categoryTexts.length > 0"
              :class="['mt-2 p-3 rounded-lg', themeStore.dark ? 'bg-neutral-800 text-gray-200' : 'bg-gray-200 text-gray-700']">
              <div class="font-semibold mb-1 text-xs uppercase tracking-wider opacity-70">Texto de entrenamiento</div>
              <div class="text-xs opacity-90 space-y-1">
                <p v-for="(text, idx) in categoryTexts" :key="idx">{{ text }}</p>
              </div>
            </div>
            <div v-else-if="textsLoading" class="mt-2 text-xs italic opacity-70">Cargando texto de entrenamiento...
            </div>
            <div v-else-if="textsError" class="mt-2 text-xs text-red-500">{{ textsError }}</div>
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
          <!-- Badge de advertencia (posición absoluta en la esquina superior izquierda) -->
          <div v-if="fileWarningsStore.hasWarning(doc.name)" @click="openWarningModal(doc.name)"
            class="absolute top-2 left-2 z-10 bg-orange-500 text-white p-1.5 rounded-full shadow-lg animate-pulse cursor-pointer hover:bg-orange-600 transition-colors"
            :title="'Clic para ver advertencia: ' + fileWarningsStore.getWarning(doc.name)?.message">
            <AlertCircle class="w-3 h-3" />
          </div>

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
              <button @click="openMoveModal(doc)"
                :class="[themeStore.dark ? 'bg-yellow-500/20 hover:bg-yellow-500/30' : 'bg-yellow-100 hover:bg-yellow-200', 'p-1.5 rounded-md transition-colors cursor-pointer']"
                title="Mover a otra categoría">
                <Pencil :class="themeStore.dark ? 'text-yellow-400' : 'text-yellow-600'" class="w-4 h-4" />
              </button>
              <button @click="deleteDocument(doc.id)"
                :class="[themeStore.dark ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-red-100 hover:bg-red-200', 'p-1.5 rounded-md transition-colors cursor-pointer']"
                title="Eliminar documento">
                <Trash2 :class="themeStore.dark ? 'text-red-400' : 'text-red-600'" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <h4 :class="['font-medium text-base mb-1 truncate', themeStore.dark ? 'text-white' : 'text-gray-900']">{{
            doc.name }}</h4>
          <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{
            doc.extension.toUpperCase() }} • {{ doc.size }} • {{ doc.category }}</p>

          <!-- Badge de advertencia adicional con mensaje -->
          <div v-if="fileWarningsStore.hasWarning(doc.name)" @click="openWarningModal(doc.name)" :class="[
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 border cursor-pointer hover:scale-105 transition-transform',
            themeStore.dark
              ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30'
              : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
          ]">
            <AlertCircle class="w-3 h-3" />
            <span class="truncate">Archivo movido - Ver advertencia</span>
          </div>
        </div>
      </div>
      <div v-else
        :class="['text-center py-24 flex flex-col items-center justify-center space-y-4', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">
        <FileX :class="themeStore.dark ? 'text-gray-500' : 'text-gray-400'" class="w-16 h-16 mb-2" />
        <p class="text-lg">No hay documentos en esta categoría.</p>
      </div>
    </div>
    <NotificationComponent v-if="showNotification" :type="notificationType" :message="notificationMessage"
      :duration="4000" class="fixed top-21 right-0 z-[9999] w-[420px] max-w-full"
      style="border-radius: 1.5rem 0 0 1.5rem;" />

    <!-- Modal para mover archivo de categoría -->
    <BaseModal :visible="showMoveModal" title="Mover archivo" subtitle="Selecciona la nueva categoría para este archivo"
      :header-icon="FolderIcon" icon-color="green" @close="closeMoveModal">
      <!-- File Info -->
      <div class="space-y-3">
        <div class="flex items-center p-3 rounded-lg" :class="themeStore.dark ? 'bg-neutral-700/30' : 'bg-gray-50'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="truncate font-medium">{{ selectedFile?.name }}</span>
        </div>

        <div class="flex items-center p-3 rounded-lg" :class="themeStore.dark ? 'bg-neutral-700/30' : 'bg-gray-50'">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span class="truncate">Categoría actual: <span class="font-semibold">{{ selectedFile?.category
          }}</span></span>
        </div>
      </div>

      <!-- Category Selector -->
      <div>
        <label class="block text-sm font-medium mb-2">Nueva categoría</label>
        <div class="relative">
          <select v-model="targetCategory"
            class="appearance-none w-full rounded-lg border px-4 py-3 pr-8 focus:ring-2 focus:outline-none transition-all"
            :class="[
              themeStore.dark
                ? 'bg-neutral-700 text-white border-white/20 focus:ring-green-500/50 focus:border-green-500'
                : 'bg-white text-gray-900 border-gray-300 focus:ring-green-500/30 focus:border-green-500'
            ]">
            <option value="" disabled selected>Selecciona una categoría</option>
            <option v-for="cat in allCategories" :key="cat" :value="cat" :disabled="cat === selectedFile?.category"
              class="py-2">
              {{ cat }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <template #actions>
        <button @click="moveFileCategory" :disabled="!targetCategory || targetCategory === selectedFile?.category"
          class="w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center cursor-pointer"
          :class="[
            (!targetCategory || targetCategory === selectedFile?.category)
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : (themeStore.dark
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/20'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/30'),
            'group'
          ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Confirmar movimiento
        </button>
      </template>
    </BaseModal>

    <!-- Modal para confirmar eliminación -->
    <BaseModal :visible="showDeleteModal" title="Confirmar eliminación" subtitle="Esta acción no se puede deshacer"
      :header-icon="AlertTriangle" icon-color="red" @close="closeDeleteModal">
      <!-- Información del archivo -->
      <div class="flex items-center p-4 rounded-lg"
        :class="themeStore.dark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'">
        <Trash2 :class="themeStore.dark ? 'text-red-400' : 'text-red-600'" class="w-6 h-6 mr-3 flex-shrink-0" />
        <div>
          <p class="font-medium">¿Estás seguro de que deseas eliminar este documento?</p>
          <p class="text-sm opacity-80 mt-1">{{ fileToDelete?.name }}</p>
        </div>
      </div>

      <!-- Botones de acción -->
      <template #actions>
        <div class="flex space-x-3">
          <button @click="closeDeleteModal"
            class="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
            :class="themeStore.dark ? 'bg-neutral-600 hover:bg-neutral-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'">
            Cancelar
          </button>
          <button @click="confirmDeleteDocument"
            class="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer bg-red-600 hover:bg-red-700 text-white">
            Eliminar
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Modal de advertencia -->
    <BaseModal :visible="showWarningModal" title="Advertencia de movimiento"
      subtitle="El archivo fue movido desde su categoría original" :header-icon="AlertCircle" icon-color="yellow"
      @close="closeWarningModal">
      <!-- Información del archivo -->
      <div class="space-y-4">
        <div class="flex items-center p-4 rounded-lg"
          :class="themeStore.dark ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'">
          <AlertCircle :class="themeStore.dark ? 'text-orange-400' : 'text-orange-600'"
            class="w-6 h-6 mr-3 flex-shrink-0" />
          <div>
            <p class="font-medium">{{ selectedWarning?.filename }}</p>
            <p class="text-sm opacity-80 mt-1">Este archivo fue movido manualmente</p>
          </div>
        </div>

        <!-- Mensaje de advertencia -->
        <div :class="[
          'p-4 rounded-lg border-l-4',
          themeStore.dark
            ? 'bg-neutral-800 border-orange-500 text-gray-300'
            : 'bg-gray-50 border-orange-500 text-gray-700'
        ]">
          <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 text-orange-500" />
            Advertencia del Sistema
          </h4>
          <p class="text-sm leading-relaxed">{{ selectedWarning?.message }}</p>
        </div>

        <!-- Información del movimiento -->
        <div v-if="fileWarningsStore.getWarning(selectedWarning?.filename || '')" class="space-y-2">
          <h5 class="font-medium text-sm">Detalles del movimiento:</h5>
          <div class="flex items-center justify-between p-3 rounded-lg"
            :class="themeStore.dark ? 'bg-neutral-700/50' : 'bg-gray-100'">
            <div class="flex items-center space-x-2">
              <div class="px-3 py-1 rounded-full text-xs font-medium"
                :class="themeStore.dark ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'">
                Categoría Original
              </div>
              <span class="text-sm font-medium">{{ fileWarningsStore.getWarning(selectedWarning?.filename ||
                '')?.fromCategory }}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div class="flex items-center space-x-2">
              <div class="px-3 py-1 rounded-full text-xs font-medium"
                :class="themeStore.dark ? 'bg-orange-600/20 text-orange-400' : 'bg-orange-100 text-orange-700'">
                Categoría Actual
              </div>
              <span class="text-sm font-medium">{{ fileWarningsStore.getWarning(selectedWarning?.filename ||
                '')?.toCategory
                }}</span>
            </div>
          </div>
        </div>

        <!-- Información adicional -->
        <div :class="[
          'p-3 rounded-lg text-xs',
          themeStore.dark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'
        ]">
          <strong>Nota:</strong> Esta advertencia aparece cuando mueves un archivo desde su categoría original
          (asignada automáticamente por el modelo de IA) a una categoría diferente. Puedes restaurarlo a su categoría
          original usando el botón "Restaurar Original".
        </div>
      </div>

      <!-- Botones de acción -->
      <template #actions>
        <div class="flex space-x-3">
          <button @click="closeWarningModal"
            class="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
            :class="themeStore.dark ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'">
            Entendido
          </button>
          <button @click="restoreToOriginalCategory"
            class="flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Restaurar Original
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Modal de Previsualización de Documentos -->
    <div v-if="showPreviewModal"
      class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div :class="[
        themeStore.dark
          ? 'bg-neutral-800 text-white border-white/10'
          : 'bg-white text-neutral-800 border-gray-200',
        'rounded-xl border shadow-2xl relative transform transition-all duration-300 scale-100',
        'w-[95vw] h-[95vh] max-w-7xl max-h-[95vh] overflow-hidden flex flex-col'
      ]">
        <!-- Header del Modal -->
        <div class="flex items-center justify-between p-6 border-b"
          :class="themeStore.dark ? 'border-white/10' : 'border-gray-200'">
          <div class="flex items-center space-x-3">
            <div :class="getFileIcon(previewDocument?.extension || '').bg"
              class="w-10 h-10 rounded-lg flex items-center justify-center text-white">
              <component :is="getFileIcon(previewDocument?.extension || '').icon" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-xl font-bold">{{ previewDocument?.name }}</h3>
              <p class="text-sm opacity-70">Previsualización del documento</p>
            </div>
          </div>
          <button @click="closePreviewModal" :class="[
            themeStore.dark
              ? 'hover:bg-neutral-700 text-neutral-300'
              : 'hover:bg-gray-100 text-gray-500',
            'p-2 rounded-full transition-colors cursor-pointer'
          ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido del Modal -->
        <div class="flex-1 overflow-hidden">
          <!-- Loading -->
          <div v-if="previewLoading" class="flex items-center justify-center h-full">
            <div class="flex flex-col items-center space-y-4">
              <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-lg font-medium">Cargando previsualización...</p>
            </div>
          </div>

          <!-- PDF Preview -->
          <div v-else-if="previewType === 'pdf' && previewContent" class="h-full">
            <VuePdfApp :pdf="previewContent" :config="{
              sidebar: { thumbnails: true, outline: true },
              toolbar: { toolbarViewerLeft: { findbar: true, previous: true, next: true, pageNumber: true } }
            }" class="h-full w-full" />
          </div>

          <!-- DOCX Preview -->
          <div v-else-if="previewType === 'docx' && previewContent" class="h-full overflow-auto p-8"
            :class="themeStore.dark ? 'bg-neutral-900' : 'bg-gray-200'">
            <div :class="[
              'max-w-4xl mx-auto p-8 rounded-lg shadow-lg prose prose-lg',
              themeStore.dark ? 'bg-neutral-700 prose-invert' : 'bg-white'
            ]">
              <div v-html="previewContent" class="docx-content"></div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else class="flex items-center justify-center h-full">
            <div class="text-center">
              <FileX class="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p class="text-lg font-medium mb-2">No se pudo cargar la previsualización</p>
              <p class="text-sm opacity-70">El documento no está disponible o el formato no es compatible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Exportar el servicio CategoriesService para uso externo
import { CategoriesService } from '@/services/CategoriesService'
import { useRouter, useRoute } from 'vue-router'
import DashboardHeader from '@/components/DashboardHeader.vue'
import BaseModal from '@/components/BaseModal.vue'
import { Download, Eye, FileX, BookOpen, Folder, Brain, Target, Pencil, Trash2, AlertTriangle, AlertCircle } from 'lucide-vue-next'
import { getFileIcon } from '@/utils/fileUtils'
import { computed, ref, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useDocumentsStore } from '@/stores/documents'
import { DocumentService } from '@/services/DocumentService'
import NotificationComponent from '@/components/NotificationComponent.vue'
import { useCategoriesStore } from '@/stores/categories'
import { useAuthStore } from '@/stores/auth'
import { useFileWarningsStore } from '@/stores/fileWarnings'
import { randomInt } from '@/utils/fileUtils'
import { watch } from 'vue'
import VuePdfApp from 'vue3-pdf-app'
import mammoth from 'mammoth'

const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()
const authStore = useAuthStore()
const categoriesStore = useCategoriesStore()
const fileWarningsStore = useFileWarningsStore()
const router = useRouter()
const route = useRoute()

const iconList = [BookOpen, Folder, Brain, Target]
const gradientList = [
  { iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500', gradient: 'from-blue-500 to-indigo-500', progressColor: 'bg-blue-500' },
  { iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500', gradient: 'from-green-500 to-emerald-500', progressColor: 'bg-green-500' },
  { iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500', gradient: 'from-purple-500 to-pink-500', progressColor: 'bg-purple-500' },
  { iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500', gradient: 'from-yellow-500 to-orange-500', progressColor: 'bg-yellow-500' },
  { iconBg: 'bg-gradient-to-r from-cyan-500 to-blue-400', gradient: 'from-cyan-500 to-blue-400', progressColor: 'bg-cyan-500' },
  { iconBg: 'bg-gradient-to-r from-pink-500 to-red-500', gradient: 'from-pink-500 to-red-500', progressColor: 'bg-pink-500' },
  { iconBg: 'bg-gradient-to-r from-gray-400 to-gray-600', gradient: 'from-gray-400 to-gray-600', progressColor: 'bg-gray-400' },
]

const categoryId = Number(route.params.id)
const categoryName = categoriesStore.categories[categoryId - 1] || 'Sin categoría'
const category = computed(() => {
  const icon = iconList[randomInt(0, iconList.length - 1)]
  const colors = gradientList[randomInt(0, gradientList.length - 1)]
  return {
    id: categoryId,
    name: categoryName,
    icon,
    ...colors,
  }
})


const documents = computed(() => {
  return documentsStore.documents
    .map((doc, idx) => ({
      id: idx + 1,
      name: doc.filename,
      category: doc.categories[0] || 'Sin categoría',
      extension: doc.filename.split('.').pop() || '',
      size: doc.content ? `${(doc.content.length / 1024).toFixed(1)} KB` : '',
      date: '',
    }))
    .filter(doc => doc.category === categoryName)
})

const totalDocuments = computed(() => documentsStore.documents.length)

function goHome() {
  router.push('/')
}

// Notificación global
const showNotification = ref(false)
const notificationType = ref<'success' | 'error' | 'info' | 'warning'>('success')
const notificationMessage = ref('')

// Modal de previsualización
const showPreviewModal = ref(false)
const previewDocument = ref<{ id: number, name: string, category: string, extension: string } | null>(null)
const previewContent = ref('')
const previewType = ref<'pdf' | 'docx' | 'unsupported'>('pdf')
const previewLoading = ref(false)

// Mapear documentos filtrados a la estructura usada en AllDocumentsView.vue
async function viewDocument(id: number) {
  const doc = documents.value.find(d => d.id === id)
  if (!doc) return

  const extension = doc.extension.toLowerCase()

  // Verificar si es un tipo de archivo soportado
  if (!['pdf', 'docx'].includes(extension)) {
    showNotification.value = true
    notificationType.value = 'warning'
    notificationMessage.value = `La previsualización no está disponible para archivos .${extension.toUpperCase()}`
    setTimeout(() => { showNotification.value = false }, 4000)
    return
  }

  previewDocument.value = doc
  previewType.value = extension as 'pdf' | 'docx'
  previewLoading.value = true
  showPreviewModal.value = true
  previewContent.value = ''

  try {
    // Descargar el archivo para previsualización
    const response = await DocumentService.downloadFileByName(doc.name, doc.category)
    const blob = response instanceof Blob ? response : response

    if (!(blob instanceof Blob)) {
      throw new Error('No se pudo obtener el archivo')
    }

    if (extension === 'pdf') {
      // Para PDF, crear URL del blob
      previewContent.value = window.URL.createObjectURL(blob)
    } else if (extension === 'docx') {
      // Para DOCX, convertir a HTML usando mammoth
      const arrayBuffer = await blob.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      previewContent.value = result.value
    }
  } catch (error) {
    console.error('Error al cargar el documento:', error)
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'Error al cargar la previsualización del documento'
    setTimeout(() => { showNotification.value = false }, 4000)
    closePreviewModal()
  } finally {
    previewLoading.value = false
  }
}

function closePreviewModal() {
  showPreviewModal.value = false
  previewDocument.value = null
  // Limpiar URL del blob para PDFs
  if (previewType.value === 'pdf' && previewContent.value) {
    window.URL.revokeObjectURL(previewContent.value)
  }
  previewContent.value = ''
  previewLoading.value = false
}

function downloadDocument(id: number) {
  const doc = documents.value.find(d => d.id === id)
  if (!doc) return

  DocumentService.downloadFileByName(doc.name, doc.category)
    .then(response => {
      const blob = response instanceof Blob ? response : response
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.name)
        document.body.appendChild(link)
        link.click()
        link.remove()
        showNotification.value = true
        notificationType.value = 'success'
        notificationMessage.value = `¡Descarga de "${doc.name}" iniciada!`
        setTimeout(() => { showNotification.value = false }, 4000)
      } else {
        showNotification.value = true
        notificationType.value = 'error'
        notificationMessage.value = 'La respuesta no es un archivo descargable.'
        setTimeout(() => { showNotification.value = false }, 4000)
      }
    })
    .catch(err => {
      console.error('Error al descargar archivo:', err)
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'Error al descargar el archivo'
      setTimeout(() => { showNotification.value = false }, 4000)
    })
}

// --- Cambiar categoría de archivo ---
const showMoveModal = ref(false)
const selectedFile = ref<{ id: number, name: string, category: string } | null>(null)
const targetCategory = ref('')
const allCategories = computed(() => categoriesStore.categories)

// --- Modal de eliminación ---
const showDeleteModal = ref(false)
const fileToDelete = ref<{ id: number, name: string, category: string } | null>(null)

// --- Modal de advertencia ---
const showWarningModal = ref(false)
const selectedWarning = ref<{ filename: string, message: string } | null>(null)

// Crear referencia al icono Folder para evitar errores
const FolderIcon = Folder

function openMoveModal(doc: { id: number, name: string, category: string }) {
  selectedFile.value = doc
  targetCategory.value = ''
  showMoveModal.value = true
}

function closeMoveModal() {
  showMoveModal.value = false
  selectedFile.value = null
  targetCategory.value = ''
}

function openDeleteModal(doc: { id: number, name: string, category: string }) {
  fileToDelete.value = doc
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  fileToDelete.value = null
}

function openWarningModal(filename: string) {
  const warning = fileWarningsStore.getWarning(filename)
  if (warning) {
    selectedWarning.value = {
      filename,
      message: warning.message
    }
    showWarningModal.value = true
  }
}

function closeWarningModal() {
  showWarningModal.value = false
  selectedWarning.value = null
}

async function restoreToOriginalCategory() {
  if (!selectedWarning.value) return

  const warning = fileWarningsStore.getWarning(selectedWarning.value.filename)
  if (!warning) return

  // Buscar el documento actual
  const currentDoc = documents.value.find(d => d.name === selectedWarning.value!.filename)
  if (!currentDoc) {
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'No se pudo encontrar el documento'
    setTimeout(() => { showNotification.value = false }, 4000)
    return
  }

  try {
    // Mover el archivo de vuelta a su categoría original
    await DocumentService.moveFile({
      filename: selectedWarning.value.filename,
      source_folder: warning.toCategory, // De donde está ahora
      target_folder: warning.fromCategory, // A donde debe ir (original)
      username: authStore.currentUser?.username || 'Unknown'
    })

    // Remover la advertencia del store
    fileWarningsStore.removeWarning(selectedWarning.value.filename)

    showNotification.value = true
    notificationType.value = 'success'
    notificationMessage.value = `El archivo "${selectedWarning.value.filename}" se ha restaurado a su categoría original "${warning.fromCategory}"`

    // Actualizar documentos y cerrar modal
    await documentsStore.fetchDocuments()
    closeWarningModal()
    setTimeout(() => { showNotification.value = false }, 4000)
  } catch (error) {
    console.error('Error al restaurar archivo:', error)
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'Error al restaurar el archivo a su categoría original'
    setTimeout(() => { showNotification.value = false }, 4000)
  }
}

function deleteDocument(id: number) {
  const doc = documents.value.find(d => d.id === id)
  if (!doc) return

  // Abrir modal de confirmación en lugar del alert
  openDeleteModal(doc)
}

function confirmDeleteDocument() {
  if (!fileToDelete.value) return

  const doc = fileToDelete.value

  // Buscar el documento real en el store para obtener su _id
  const realDoc = documentsStore.documents.find(d => d.filename === doc.name)
  if (!realDoc || !realDoc._id) {
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'No se pudo encontrar el ID del documento'
    setTimeout(() => { showNotification.value = false }, 4000)
    closeDeleteModal()
    return
  }

  DocumentService.deleteDocument(realDoc._id, authStore.currentUser?.username || 'Unknown')
    .then(() => {
      showNotification.value = true
      notificationType.value = 'success'
      notificationMessage.value = `Documento "${doc.name}" eliminado correctamente`
      // Actualizar documentos
      documentsStore.fetchDocuments()
      setTimeout(() => { showNotification.value = false }, 4000)
      closeDeleteModal()
    })
    .catch(() => {
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'Error al eliminar el documento'
      setTimeout(() => { showNotification.value = false }, 4000)
      closeDeleteModal()
    })
}

async function moveFileCategory() {
  if (!selectedFile.value || !targetCategory.value || targetCategory.value === selectedFile.value.category) return
  try {
    const response = await DocumentService.moveFile({
      filename: selectedFile.value.name,
      source_folder: selectedFile.value.category,
      target_folder: targetCategory.value,
      username: authStore.currentUser?.username || 'Unknown'
    })

    // Si hay advertencia, la guardamos en el store usando los datos del backend
    if (response.advertencia) {
      fileWarningsStore.addWarning(
        selectedFile.value.name,
        response.advertencia,
        response.original_category, // Categoría original del backend
        response.current_category   // Categoría actual del backend
      )
    }

    showNotification.value = true
    notificationType.value = 'success'
    notificationMessage.value = `El archivo "${selectedFile.value.name}" se ha movido a "${targetCategory.value}" correctamente.`
    // Actualizar documentos y cerrar modal
    await documentsStore.fetchDocuments()
    closeMoveModal()
    setTimeout(() => { showNotification.value = false }, 4000)
  } catch {
    showNotification.value = true
    notificationType.value = 'error'
    notificationMessage.value = 'Error al mover el archivo de categoría.'
    setTimeout(() => { showNotification.value = false }, 4000)
  }
}
function downloadAll() {
  const nombreCategoria = category.value.name
  DocumentService.downloadCategoryZip(nombreCategoria)
    .then(response => {
      console.log('Respuesta de descarga por categoría:', response)
      const blob = response instanceof Blob ? response : response
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${nombreCategoria}.zip`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        showNotification.value = true
        notificationType.value = 'success'
        notificationMessage.value = `¡Descarga de "${nombreCategoria}" iniciada!`
        setTimeout(() => { showNotification.value = false }, 4000)
      } else {
        console.error('La respuesta no es un Blob:', response)
        showNotification.value = true
        notificationType.value = 'error'
        notificationMessage.value = 'La respuesta no es un archivo descargable.'
        setTimeout(() => { showNotification.value = false }, 4000)
      }
    })
    .catch(err => {
      console.error('Error al descargar por categoría:', err)
      showNotification.value = true
      notificationType.value = 'error'
      notificationMessage.value = 'Error al descargar los documentos de la categoría'
      setTimeout(() => { showNotification.value = false }, 4000)
    })
}
// Textos de entrenamiento de la categoría
const categoryTexts = ref<string[]>([])
const textsLoading = ref(false)
const textsError = ref('')

async function fetchCategoryTexts(nombreCategoria: string) {
  if (!nombreCategoria) return
  textsLoading.value = true
  textsError.value = ''
  try {
    const res = await CategoriesService.getTextsByCategory(nombreCategoria)
    categoryTexts.value = Array.isArray(res) ? res : []
  } catch (err: unknown) {
    textsError.value = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Error al obtener textos de entrenamiento')
  } finally {
    textsLoading.value = false
  }
}

onMounted(() => {
  categoriesStore.fetchCategories()
  fileWarningsStore.init()
  fetchCategoryTexts(categoryName)
})

// Si cambia la categoría, recargar textos
watch(() => categoryName, (nuevo) => {
  fetchCategoryTexts(nuevo)
})
</script>

<style scoped>
/* Estilos para el contenido DOCX */
.docx-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.docx-content :deep(h1),
.docx-content :deep(h2),
.docx-content :deep(h3),
.docx-content :deep(h4),
.docx-content :deep(h5),
.docx-content :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.docx-content :deep(ul),
.docx-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.docx-content :deep(li) {
  margin-bottom: 0.5rem;
}

.docx-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.docx-content :deep(td),
.docx-content :deep(th) {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.docx-content :deep(th) {
  background-color: #f9fafb;
  font-weight: bold;
}

/* Dark mode styles for DOCX content */
.dark .docx-content :deep(td),
.dark .docx-content :deep(th) {
  border-color: #4b5563;
}

.dark .docx-content :deep(th) {
  background-color: #374151;
}
</style>
