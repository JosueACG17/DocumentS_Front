<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    themeStore.dark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900',
  ]">
    <DashboardHeader :total-documents="totalDocuments" />
    <div class="relative z-10 mx-auto px-6 py-8">
      <button @click="goHome" :class="[
        'cursor-pointer mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow transition-colors',
        themeStore.dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      ]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Regresar</span>
      </button>

      <h2 class="text-2xl font-bold mb-6 flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center">
          <FolderOpen class="w-6 h-6 mr-2 text-blue-400" />
          Todas las Categorías
          <span class="ml-2 text-blue-400 text-base font-normal">({{ categories.length }})</span>
        </div>
        <button @click="showAddModal = true"
          class="ml-auto px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center"
          :class="themeStore.dark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'">
          <Plus class="w-4 h-4 mr-2" />
          Agregar categoría
        </button>
      </h2>

      <div v-if="categories.length === 0" :class="[
        'flex flex-col items-center justify-center gap-3 text-center py-10 px-4 rounded-xl border transition-all duration-300',
        themeStore.dark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600',
      ]">
        <FolderOpen class="w-10 h-10 text-blue-400 opacity-70" />
        <p class="text-base font-medium">No se encontraron categorías de archivos</p>
        <p class="text-sm opacity-70">Sube documentos para comenzar a organizarlos automáticamente.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="category in categories" :key="category.id" @click="goToCategory(category.id)" :class="[
          'relative group cursor-pointer rounded-xl p-6 transition-all duration-300 hover:scale-105',
          themeStore.dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100 border border-gray-300',
          selectedCategory === category.id ? 'ring-2 ring-blue-400' : '',
        ]">
          <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity rounded-xl"
            :class="category.gradient"></div>
          <div class="relative flex flex-col items-center">
            <div :class="category.iconBg" class="w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <component :is="category.icon" class="w-6 h-6 text-white" />
            </div>
            <h4 :class="['font-medium text-base mb-1', themeStore.dark ? 'text-white' : 'text-gray-900']">{{
              category.name }}</h4>
            <p :class="['text-xs mb-2', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ category.count }} docs
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar categoria -->
    <BaseModal :visible="showAddModal" title="Agregar nueva categoría" :header-icon="Folder" icon-color="blue"
      @close="closeAddModal">
      <!-- Campo Nombre Categoría -->
      <div>
        <label class="block mb-1 font-medium" for="category-name">Nombre de la categoría</label>
        <input id="category-name" v-model="newCategory" type="text" placeholder="Ej. Salud, Finanzas, etc." :class="[
          'w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2',
          themeStore.dark
            ? 'bg-neutral-700 border-neutral-600 focus:ring-blue-400'
            : 'bg-white border-gray-300 focus:ring-blue-500',
        ]" />
      </div>

      <!-- Campo Texto de entrenamiento -->
      <div>
        <label class="block mb-1 font-medium" for="example-text">Texto de entrenamiento</label>
        <textarea id="example-text" v-model="newText" rows="4" placeholder="Ej. Tengo fiebre y dolor de cabeza..."
          :class="[
            'w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none',
            themeStore.dark
              ? 'bg-neutral-700 border-neutral-600 focus:ring-blue-400'
              : 'bg-white border-gray-300 focus:ring-blue-500',
          ]"></textarea>
      </div>

      <!-- Botón Guardar -->
      <template #actions>
        <button @click="handleCreateCategory"
          class="w-full py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer"
          :class="themeStore.dark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'">
          <Check class="w-6 h-6" />
          Guardar categoría
        </button>
      </template>
    </BaseModal>


    <!-- Notificaciones -->
    <CustomNotification v-if="notification.visible" :type="notification.type" :message="notification.message"
      :duration="3000" @close="notification.visible = false" class="fixed right-0 z-[9999] w-[420px] max-w-full"
      style="border-radius: 1.5rem 0 0 1.5rem;" />
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '@/components/DashboardHeader.vue'
import CustomNotification from '@/components/NotificationComponent.vue'
import BaseModal from '@/components/BaseModal.vue'
import { useThemeStore } from '@/stores/theme'
import { useCategoriesStore } from '@/stores/categories'
import { Folder, Check, Plus } from 'lucide-vue-next'
import { useDocumentsStore } from '@/stores/documents'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FolderOpen } from 'lucide-vue-next'
import { randomInt } from '@/utils/fileUtils'
import { CategoriesService } from '@/services/CategoriesService'

const themeStore = useThemeStore()
const categoriesStore = useCategoriesStore()
const documentsStore = useDocumentsStore()
const router = useRouter()

const selectedCategory = null
const showAddModal = ref(false)
const newCategory = ref('')
const newText = ref('')

const notification = ref({
  visible: false,
  type: 'info' as 'success' | 'error' | 'info' | 'warning',
  message: '',
})

function showNotification(type: 'success' | 'error' | 'info' | 'warning', message: string) {
  notification.value = {
    visible: true,
    type,
    message,
  }
}
const totalDocuments = computed(() => documentsStore.documents.length)
const iconList = [FolderOpen]
const gradientList = [
  { iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500', gradient: 'from-blue-500 to-indigo-500' },
  { iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500', gradient: 'from-green-500 to-emerald-500' },
  { iconBg: 'bg-gradient-to-r from-purple-500 to-pink-500', gradient: 'from-purple-500 to-pink-500' },
  { iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500', gradient: 'from-yellow-500 to-orange-500' },
  { iconBg: 'bg-gradient-to-r from-cyan-500 to-blue-400', gradient: 'from-cyan-500 to-blue-400' },
  { iconBg: 'bg-gradient-to-r from-pink-500 to-red-500', gradient: 'from-pink-500 to-red-500' },
  { iconBg: 'bg-gradient-to-r from-gray-400 to-gray-600', gradient: 'from-gray-400 to-gray-600' },
]

const categories = computed(() => {
  const counts = documentsStore.documents.reduce<Record<string, number>>((acc, doc) => {
    const cat = doc.categories?.[0] || 'Sin categoría'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  return categoriesStore.categories.map((name, idx) => {
    const count = counts[name] || 0
    const icon = iconList[randomInt(0, iconList.length - 1)]
    const colors = gradientList[randomInt(0, gradientList.length - 1)]
    return {
      id: idx + 1,
      name,
      count,
      icon,
      ...colors,
    }
  })
})

function goToCategory(id: number) {
  router.push({ name: 'category-documents', params: { id } })
}

function goHome() {
  router.push('/')
}

async function handleCreateCategory() {
  const categoryName = newCategory.value.trim()
  const text = newText.value.trim()

  if (!categoryName || !text) {
    showNotification('error', 'Llenar ambos campos')
    return
  }

  if (categoriesStore.categories.includes(categoryName)) {
    showNotification('error', 'Esa categoría ya existe')
    closeAddModal()
    return
  }

  try {
    await CategoriesService.createTrainingExample({ category: categoryName, text })
    await CategoriesService.trainModel()
    categoriesStore.addCategory(categoryName)
    showNotification('success', 'Categoría creada y modelo entrenado correctamente')
    newCategory.value = ''
    newText.value = ''
    closeAddModal()
  } catch (error) {
    console.error(error)
    showNotification('error', 'Error al crear la categoría o entrenar el modelo')
  }
}

function closeAddModal() {
  showAddModal.value = false
  newCategory.value = ''
  newText.value = ''
}
</script>
