<template>
  <!-- Botón flotante para abrir/cerrar el bot -->
  <button v-if="!isOpen" @click="handleButtonClick" :style="{
    top: buttonPosition.y + 'px',
    left: buttonPosition.x + 'px',
    transition: isDragging ? 'none' : 'left 0.3s ease-out'
  }" :class="[
    'fixed z-[9998] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110',
    'backdrop-blur-sm border border-white/20 cursor-move',
    themeStore.dark
      ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white hover:from-purple-500 hover:to-blue-500'
      : 'bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white hover:from-purple-400 hover:to-blue-400'
  ]" @mousedown="startDragging" @dragstart.prevent>
    <Sparkles class="w-6 h-6" />
  </button>

  <!-- Panel del chatbot -->
  <div v-if="isOpen" :style="{
    top: panelPosition.y + 'px',
    left: panelPosition.x + 'px',
    transition: isDragging ? 'none' : 'left 0.3s ease-out'
  }" :class="[
    'fixed z-[9999] transition-all duration-300 transform',
    'w-80 h-[500px] rounded-xl shadow-2xl border backdrop-blur-sm',
    themeStore.dark
      ? 'bg-neutral-800/95 border-white/10 text-white'
      : 'bg-white/95 border-gray-200 text-neutral-800'
  ]">
    <!-- Header del bot (draggable) -->
    <div @mousedown="startDraggingPanel" :class="[
      'flex items-center justify-between p-4 border-b rounded-t-xl cursor-move',
      'bg-gradient-to-r from-purple-500/10 to-blue-500/10',
      themeStore.dark ? 'border-white/10' : 'border-gray-200'
    ]">
      <div class="flex items-center space-x-3">
        <div class="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
          <Bot class="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-sm">Asistente de Archivos</h3>
          <p class="text-xs opacity-60">{{ statusMessage }}</p>
        </div>
      </div>
      <div class="flex space-x-2">

        <!-- Botón para cerrar -->
        <button @click="toggleBot" :class="[
          'p-1 rounded-full transition-colors',
          themeStore.dark ? 'hover:bg-neutral-700' : 'hover:bg-gray-100'
        ]">
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Contenido del bot (oculto cuando está minimizado) -->
    <div v-if="!isMinimized" class="flex flex-col h-[calc(100%-72px)]">
      <!-- Buscador -->
      <div class="p-4 border-b" :class="themeStore.dark ? 'border-white/10' : 'border-gray-200'">
        <div class="relative">
          <Search :class="[
            'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4',
            themeStore.dark ? 'text-gray-400' : 'text-gray-500'
          ]" />
          <input v-model="searchQuery" @input="handleSearch" @focus="showSuggestions = true"
            placeholder="Buscar documentos y categorías..." :class="[
              'w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium',
              themeStore.dark
                ? 'bg-gray-800/10 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-blue-50/30',
              'focus:outline-none focus:ring-4',
              themeStore.dark ? 'focus:ring-blue-500/20' : 'focus:ring-blue-500/10'
            ]" />
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Resultados de búsqueda -->
        <div v-if="searchQuery && allResults.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Resultados ({{ allResults.length }})
          </h4>
          <div v-for="result in allResults"
            :key="`${result.type}-${result.type === 'document' ? (result.item as DocumentData)._id : result.item as string}`"
            :class="[
              'p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg border',
              themeStore.dark
                ? 'bg-gray-800/10 hover:bg-gray-700/70 border-gray-700/50 hover:border-gray-600'
                : 'bg-white hover:bg-white border-gray-300/50 hover:border-gray-300 hover:shadow-blue-100/50 '
            ]"
            @click="result.type === 'document' ? selectDocument(result.item as DocumentData) : selectCategory(result.item as string)">
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-1">
                <template v-if="result.type === 'document'">
                  <FileType v-if="(result.item as DocumentData).filename.toLowerCase().endsWith('.pdf')"
                    class="h-5 w-5 text-red-500 dark:text-red-400" />
                  <FileText v-else class="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </template>
                <FolderOpen v-else class="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div :class="[
                  'font-medium truncate',
                  themeStore.dark ? 'text-white' : 'text-gray-900'
                ]">
                  {{ result.type === 'document' ? (result.item as DocumentData).filename : (result.item as string) }}
                </div>
                <div :class="[
                  'text-xs mt-1',
                  themeStore.dark ? 'text-gray-400' : 'text-gray-500'
                ]">
                  {{ result.type === 'document' ? (result.item as DocumentData).categories.join(', ') : 'Categoría' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="searchQuery && allResults.length === 0" class="text-center py-8">
          <Search :class="[
            'w-8 h-8 mx-auto mb-3',
            themeStore.dark ? 'text-gray-500' : 'text-gray-400'
          ]" />
          <p :class="[
            'text-sm',
            themeStore.dark ? 'text-white' : 'text-gray-600'
          ]">No se encontraron documentos</p>
          <p :class="[
            'text-xs mt-1',
            themeStore.dark ? 'text-gray-200' : 'text-gray-400'
          ]">Intenta con otros términos</p>
        </div>

        <!-- Vista por defecto -->
        <div v-else class="space-y-6">
          <!-- Archivos recientes -->
          <div>
            <h4 class="text-xs font-semibold opacity-70 uppercase tracking-wider mb-3 flex items-center">
              <Clock class="w-3 h-3 mr-2" />
              Archivos Recientes
            </h4>
            <div class="space-y-2">
              <div v-for="doc in recentDocuments" :key="doc._id" @click="selectDocument(doc)" :class="[
                'p-4 rounded-xl cursor-pointer transition-all duration-200 border hover:shadow-lg',
                themeStore.dark
                  ? 'bg-gray-800/10 hover:bg-gray-700/70 border-gray-700/50 hover:border-gray-600'
                  : 'bg-white/80 hover:bg-white border-gray-300/50 hover:border-gray-300 hover:shadow-blue-100/50'
              ]">
                <div class="flex items-center space-x-3">
                  <div :class="[
                    'p-2 rounded-lg',
                    doc.filename.toLowerCase().endsWith('.pdf')
                      ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20'
                      : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
                  ]">
                    <FileType v-if="doc.filename.toLowerCase().endsWith('.pdf')"
                      class="w-4 h-4 text-red-500 dark:text-red-400" />
                    <FileText v-else class="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">{{ doc.filename }}</p>
                    <p class="text-xs opacity-60">{{ doc.categories?.[0] || 'Sin categoría' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div>
            <h4 class="text-xs font-semibold opacity-70 uppercase tracking-wider mb-3 flex items-center">
              <Zap class="w-3 h-3 mr-2" />
              Acciones Rápidas
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <button @click="showAllFiles" :class="[
                'p-3 rounded-lg border transition-all duration-200 text-left cursor-pointer',
                themeStore.dark
                  ? 'hover:bg-neutral-700 border-neutral-700 hover:border-green-500/50'
                  : 'hover:bg-gray-50 border-gray-200 hover:border-green-500/50'
              ]">
                <List class="w-4 h-4 text-green-500 mb-2" />
                <p class="text-xs font-medium">Ver Todos</p>
              </button>
              <button @click="showByCategory" :class="[
                'p-3 rounded-lg border transition-all duration-200 text-left cursor-pointer',
                themeStore.dark
                  ? 'hover:bg-neutral-700 border-neutral-700 hover:border-orange-500/50'
                  : 'hover:bg-gray-50 border-gray-200 hover:border-orange-500/50'
              ]">
                <FolderOpen class="w-4 h-4 text-orange-500 mb-2" />
                <p class="text-xs font-medium">Por Categoría</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useDocumentsStore } from '@/stores/documents'
import { useCategoriesStore } from '@/stores/categories'
import Fuse from 'fuse.js'
import type { DocumentData } from '@/types/apiresponse'

// Icons
import {
  Bot,
  X,
  Search,
  FileText,
  FileType,
  Clock,
  Zap,
  List,
  FolderOpen,
  Sparkles,
} from 'lucide-vue-next'

// Props
interface Props {
  topOffset?: number
}

const props = withDefaults(defineProps<Props>(), {
  topOffset: 80 
})

// Stores
const themeStore = useThemeStore()
const documentsStore = useDocumentsStore()
const categoriesStore = useCategoriesStore()

// State
const isOpen = ref(false)
const isMinimized = ref(false)
const searchQuery = ref('')
const allResults = ref<Array<{ item: DocumentData | string; score?: number; type: 'document' | 'category' }>>([])
const showSuggestions = ref(false)
const selectedDocument = ref<DocumentData | null>(null)

// Dragging state
const isDragging = ref(false)
const hasDragged = ref(false) // Para detectar si realmente se arrastró
const dragOffset = ref({ x: 0, y: 0 })
const buttonPosition = ref({ x: window.innerWidth - 72, y: props.topOffset }) // Pegado completamente a la orilla
const panelPosition = ref({ x: window.innerWidth - 320 - 8, y: props.topOffset }) // Panel más pegado (8px margen)

// Fuse.js configuración para documentos Y categorías
const fuseOptions = {
  keys: [
    { name: 'filename', weight: 0.7 },
    { name: 'content', weight: 0.3 },
    { name: 'categories', weight: 0.5 }
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true
}

const categoriesFuseOptions = {
  keys: ['name'],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true
}

const fuse = computed(() => {
  return new Fuse(documentsStore.documents, fuseOptions)
})

const categoriesFuse = computed(() => {
  return new Fuse(categoriesStore.categories.map(name => ({ name })), categoriesFuseOptions)
})

// Computed
const statusMessage = computed(() => {
  if (searchQuery.value) return 'Buscando...'
  if (documentsStore.documents.length === 0) return 'Sin documentos'
  return `${documentsStore.documents.length} documentos disponibles`
})

const recentDocuments = computed(() => {
  return documentsStore.documents.slice(0, 5)
})

// Methods
const toggleBot = () => {
  isOpen.value = !isOpen.value
  isMinimized.value = false // Resetear minimizado al abrir
  if (!isOpen.value) {
    searchQuery.value = ''
    allResults.value = []
    showSuggestions.value = false
  }
}

// Dragging methods
const magnetizeToEdge = (x: number) => {
  const screenWidth = window.innerWidth
  const centerX = screenWidth / 2

  // Pegado completamente a las orillas (0px margen)
  return x < centerX ? 0 : screenWidth - 72 // 72px = ancho del botón
}

const magnetizePanelToEdge = (x: number) => {
  const screenWidth = window.innerWidth
  const panelWidth = 320
  const centerX = screenWidth / 2

  // Panel con muy poco margen (8px)
  return x < centerX ? 8 : screenWidth - panelWidth - 8
}

const startDragging = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
  hasDragged.value = false

  dragOffset.value = {
    x: e.clientX - buttonPosition.value.x,
    y: e.clientY - buttonPosition.value.y
  }

  const startX = e.clientX
  const startY = e.clientY

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
      const deltaX = Math.abs(e.clientX - startX)
      const deltaY = Math.abs(e.clientY - startY)

      // Si se mueve más de 5px, entonces realmente está arrastrando
      if (deltaX > 5 || deltaY > 5) {
        hasDragged.value = true
      }

      buttonPosition.value = {
        x: Math.max(0, Math.min(window.innerWidth - 72, e.clientX - dragOffset.value.x)),
        y: Math.max(props.topOffset, Math.min(window.innerHeight - 72, e.clientY - dragOffset.value.y))
      }
    }
  }

  const handleMouseUp = () => {
    isDragging.value = false

    // Solo magnetizar si realmente se arrastró
    if (hasDragged.value) {
      const magnetizedX = magnetizeToEdge(buttonPosition.value.x)
      buttonPosition.value.x = magnetizedX

      // También actualizar la posición del panel para que aparezca en el lado correcto
      panelPosition.value.x = magnetizePanelToEdge(buttonPosition.value.x)
    }

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Método separado para el click (abrir bot)
const handleButtonClick = () => {
  // Solo abrir si NO se arrastró
  if (!hasDragged.value) {
    toggleBot()
  }
  hasDragged.value = false // Reset para el próximo click
}

const startDraggingPanel = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - panelPosition.value.x,
    y: e.clientY - panelPosition.value.y
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
      panelPosition.value = {
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.value.x)),
        y: Math.max(props.topOffset, Math.min(window.innerHeight - 500, e.clientY - dragOffset.value.y))
      }
    }
  }

  const handleMouseUp = () => {
    isDragging.value = false

    // Magnetizar a la orilla más cercana
    const magnetizedX = magnetizePanelToEdge(panelPosition.value.x)
    panelPosition.value.x = magnetizedX

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    allResults.value = []
    return
  }

  // Buscar en documentos
  const documentResults = fuse.value.search(searchQuery.value).map(result => ({
    item: result.item,
    score: result.score,
    type: 'document' as const
  }))

  // Buscar en categorías
  const categoryResults = categoriesFuse.value.search(searchQuery.value).map(result => ({
    item: result.item.name,
    score: result.score,
    type: 'category' as const
  }))

  // Combinar resultados (categorías primero, luego documentos)
  allResults.value = [...categoryResults, ...documentResults]
}

const selectDocument = (doc: DocumentData) => {
  selectedDocument.value = doc
  // Cerrar el bot al seleccionar documento
  isOpen.value = false

  // Emit evento para previsualizar el documento
  emit('document-selected', doc)

  // Limpiar búsqueda
  searchQuery.value = ''
  allResults.value = []
}

const selectCategory = (categoryName: string) => {
  // Cerrar el bot al seleccionar categoría
  isOpen.value = false

  // Limpiar búsqueda
  searchQuery.value = ''
  allResults.value = []

  // Navegar a la categoría
  emit('category-selected', categoryName)
  emit('show-notification', 'info', `Navegando a categoría: ${categoryName}`)
}

const showAllFiles = () => {
  searchQuery.value = ''
  allResults.value = []
  emit('show-all-files')
  emit('show-notification', 'info', 'Mostrando todos los archivos')
}

const showByCategory = () => {
  emit('show-by-category')
  emit('show-notification', 'info', 'Navegando por categorías')
}// Emits
const emit = defineEmits<{
  'document-selected': [document: DocumentData]
  'category-selected': [categoryName: string]
  'show-notification': [type: string, message: string]
  'show-all-files': []
  'show-by-category': []
}>()

// Lifecycle
onMounted(() => {
  // Cargar documentos si no están cargados
  if (documentsStore.documents.length === 0) {
    documentsStore.fetchDocuments()
  }
})

// Close bot when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value) {
    const target = event.target as HTMLElement
    if (!target.closest('.fixed')) {
      // isOpen.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animaciones personalizadas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(228, 220, 236, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.5);
}
</style>
