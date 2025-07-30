<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    themeStore.dark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900',
  ]">
    <DashboardHeader />

    <div class="relative z-10 mx-auto px-6 py-8">
      <!-- Back Button -->
      <button @click="goHome" :class="[
        'cursor-pointer mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium shadow transition-colors',
        themeStore.dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      ]">
        <ArrowLeft class="h-5 w-5 text-blue-400" />
        <span>Regresar</span>
      </button>

      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center space-x-4">
            <div :class="[
              'w-16 h-16 rounded-2xl flex items-center justify-center',
              themeStore.dark
                ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
            ]">
              <History :class="[
                'w-8 h-8',
                themeStore.dark ? 'text-blue-400' : 'text-blue-600'
              ]" />
            </div>
            <div>
              <h1 :class="[
                'text-3xl font-bold',
                themeStore.dark ? 'text-white' : 'text-gray-900'
              ]">
                Historial de Auditoría
              </h1>
              <p :class="[
                'text-lg',
                themeStore.dark ? 'text-gray-400' : 'text-gray-600'
              ]">
                Registro completo de todas las operaciones del sistema
              </p>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex items-center space-x-4">
            <div :class="[
              'px-4 py-2 rounded-xl border',
              themeStore.dark
                ? 'bg-neutral-800/50 border-neutral-700 text-gray-300'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            ]">
              <span class="text-sm">Total: {{ filteredLogs.length }} operaciones</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div :class="[
        'rounded-2xl border p-6 mb-8',
        themeStore.dark
          ? 'bg-neutral-800/80 border-neutral-700 backdrop-blur-sm'
          : 'bg-white border-gray-200 backdrop-blur-sm'
      ]">
        <div class="flex items-center space-x-3 mb-4">
          <Filter :class="[
            'w-5 h-5',
            themeStore.dark ? 'text-blue-400' : 'text-blue-600'
          ]" />
          <h3 :class="[
            'text-lg font-semibold',
            themeStore.dark ? 'text-white' : 'text-gray-900'
          ]">
            Filtros
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Operation Filter -->
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              themeStore.dark ? 'text-gray-300' : 'text-gray-700'
            ]">
              Tipo de Operación
            </label>
            <select v-model="selectedOperation" :class="[
              'w-full px-4 py-2 rounded-lg border transition-colors',
              themeStore.dark
                ? 'bg-neutral-700 border-neutral-600 text-white focus:border-blue-400'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            ]">
              <option value="">Todas las operaciones</option>
              <option v-for="operation in operationTypes" :key="operation" :value="operation">
                {{ operation }}
              </option>
            </select>
          </div>

          <!-- User Filter -->
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              themeStore.dark ? 'text-gray-300' : 'text-gray-700'
            ]">
              Usuario
            </label>
            <select v-model="selectedUser" :class="[
              'w-full px-4 py-2 rounded-lg border transition-colors',
              themeStore.dark
                ? 'bg-neutral-700 border-neutral-600 text-white focus:border-blue-400'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            ]">
              <option value="">Todos los usuarios</option>
              <option v-for="user in usersList" :key="user" :value="user">
                {{ user }}
              </option>
            </select>
          </div>

          <!-- Date Range -->
          <div>
            <label :class="[
              'block text-sm font-medium mb-2',
              themeStore.dark ? 'text-gray-300' : 'text-gray-700'
            ]">
              Rango de Fecha
            </label>
            <select v-model="selectedDateRange" :class="[
              'w-full px-4 py-2 rounded-lg border transition-colors',
              themeStore.dark
                ? 'bg-neutral-700 border-neutral-600 text-white focus:border-blue-400'
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            ]">
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end">
          <button @click="clearFilters" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
            themeStore.dark
              ? 'text-gray-400 hover:text-white hover:bg-neutral-700 border border-neutral-600 hover:border-neutral-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-200'
          ]">
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Logs List -->
      <div :class="[
        'rounded-2xl border',
        themeStore.dark
          ? 'bg-neutral-800/80 border-neutral-700 backdrop-blur-sm'
          : 'bg-white border-gray-200 backdrop-blur-sm'
      ]">
        <!-- Loading State -->
        <div v-if="isLoading" class="p-8">
          <div class="space-y-4">
            <div v-for="i in 10" :key="i" :class="[
              'animate-pulse flex items-center space-x-4 p-4 rounded-xl',
              themeStore.dark ? 'bg-neutral-700/50' : 'bg-gray-100/50'
            ]">
              <div :class="[
                'w-12 h-12 rounded-full',
                themeStore.dark ? 'bg-neutral-600' : 'bg-gray-300'
              ]"></div>
              <div class="flex-1 space-y-2">
                <div :class="[
                  'h-4 rounded w-3/4',
                  themeStore.dark ? 'bg-neutral-600' : 'bg-gray-300'
                ]"></div>
                <div :class="[
                  'h-3 rounded w-1/2',
                  themeStore.dark ? 'bg-neutral-600' : 'bg-gray-300'
                ]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Logs Content -->
        <div v-else-if="filteredLogs.length > 0" class="divide-y"
          :class="themeStore.dark ? 'divide-neutral-700' : 'divide-gray-200'">
          <div v-for="log in paginatedLogs" :key="log._id" :class="[
            'p-6 transition-all duration-200 hover:bg-opacity-50',
            themeStore.dark ? 'hover:bg-neutral-700' : 'hover:bg-gray-50'
          ]">
            <div class="flex items-start space-x-4">
              <!-- Operation Icon -->
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                getOperationStyle(log.operation).bg
              ]">
                <component :is="getOperationIcon(log.operation)" :class="[
                  'w-6 h-6',
                  getOperationStyle(log.operation).text
                ]" />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 :class="[
                      'text-lg font-semibold mb-1',
                      themeStore.dark ? 'text-white' : 'text-gray-900'
                    ]">
                      {{ log.operation }}
                    </h4>
                    <p :class="[
                      'text-sm mb-3',
                      themeStore.dark ? 'text-gray-300' : 'text-gray-600'
                    ]">
                      {{ getOperationDescription(log) }}
                    </p>

                    <!-- Details -->
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <span :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                        themeStore.dark
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      ]">
                        <User class="w-3 h-3 mr-1" />
                        {{ log.username }}
                      </span>

                      <span v-if="log.category" :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                        themeStore.dark
                          ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      ]">
                        <FolderOpen class="w-3 h-3 mr-1" />
                        {{ log.category }}
                      </span>

                      <span v-if="log.document_filename" :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                        themeStore.dark
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                          : 'bg-green-100 text-green-700 border border-green-200'
                      ]">
                        <FileText class="w-3 h-3 mr-1" />
                        {{ log.document_filename }}
                      </span>
                    </div>

                    <!-- Timestamp -->
                    <div class="flex items-center space-x-2">
                      <Clock :class="[
                        'w-4 h-4',
                        themeStore.dark ? 'text-gray-400' : 'text-gray-500'
                      ]" />
                      <span :class="[
                        'text-sm',
                        themeStore.dark ? 'text-gray-400' : 'text-gray-500'
                      ]">
                        {{ formatFullTimestamp(log.timestamp) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <History :class="[
            'w-16 h-16 mx-auto mb-4 opacity-50',
            themeStore.dark ? 'text-gray-400' : 'text-gray-500'
          ]" />
          <h3 :class="[
            'text-lg font-semibold mb-2',
            themeStore.dark ? 'text-gray-300' : 'text-gray-700'
          ]">
            No se encontraron registros
          </h3>
          <p :class="[
            'text-sm',
            themeStore.dark ? 'text-gray-400' : 'text-gray-500'
          ]">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredLogs.length > pageSize && !isLoading" :class="[
          'px-6 py-4 border-t flex items-center justify-between',
          themeStore.dark ? 'border-neutral-700' : 'border-gray-200'
        ]">
          <div :class="themeStore.dark ? 'text-gray-400' : 'text-gray-600'" class="text-sm">
            Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize,
              filteredLogs.length) }} de {{ filteredLogs.length }} resultados
          </div>

          <div class="flex items-center space-x-2">
            <button @click="currentPage--" :disabled="currentPage === 1" :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentPage === 1
                ? (themeStore.dark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                : (themeStore.dark ? 'text-gray-300 hover:text-white hover:bg-neutral-700 cursor-pointer' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer')
            ]">
              Anterior
            </button>

            <span :class="[
              'px-4 py-2 rounded-lg text-sm font-medium',
              themeStore.dark ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-gray-900'
            ]">
              {{ currentPage }} de {{ totalPages }}
            </span>

            <button @click="currentPage++" :disabled="currentPage === totalPages" :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              currentPage === totalPages
                ? (themeStore.dark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                : (themeStore.dark ? 'text-gray-300 hover:text-white hover:bg-neutral-700 cursor-pointer' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer')
            ]">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { AuditService } from '@/services/AuditService'
import type { AuditLog } from '@/types/auditlog'
import DashboardHeader from '@/components/DashboardHeader.vue'
import {
  History,
  ArrowLeft,
  Filter,
  Upload,
  Trash2,
  FolderOpen,
  Edit,
  FileText,
  User,
  Clock
} from 'lucide-vue-next'

const router = useRouter()
const themeStore = useThemeStore()

// State
const isLoading = ref(true)
const logs = ref<AuditLog[]>([])
const selectedOperation = ref('')
const selectedUser = ref('')
const selectedDateRange = ref('all')
const currentPage = ref(1)
const pageSize = 20

// Computed
const operationTypes = computed(() => {
  const types = [...new Set(logs.value.map(log => log.operation))]
  return types.sort()
})

const usersList = computed(() => {
  const users = [...new Set(logs.value.map(log => log.username))]
  return users.sort()
})

const filteredLogs = computed(() => {
  let filtered = [...logs.value]

  // Filter by operation
  if (selectedOperation.value) {
    filtered = filtered.filter(log => log.operation === selectedOperation.value)
  }

  // Filter by user
  if (selectedUser.value) {
    filtered = filtered.filter(log => log.username === selectedUser.value)
  }

  // Filter by date range
  if (selectedDateRange.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp)

      switch (selectedDateRange.value) {
        case 'today':
          return logDate >= today
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return logDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
          return logDate >= monthAgo
        default:
          return true
      }
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / pageSize)
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredLogs.value.slice(start, end)
})

// Methods
const goHome = () => {
  router.push('/')
}

const clearFilters = () => {
  selectedOperation.value = ''
  selectedUser.value = ''
  selectedDateRange.value = 'all'
  currentPage.value = 1
}

const getOperationIcon = (operation: string) => {
  const operationLower = operation.toLowerCase()
  if (operationLower.includes('subida')) return Upload
  if (operationLower.includes('eliminación')) return Trash2
  if (operationLower.includes('movimiento')) return FolderOpen
  if (operationLower.includes('entrenamiento')) return Edit
  return FileText
}

const getOperationStyle = (operation: string) => {
  const operationLower = operation.toLowerCase()
  if (operationLower.includes('subida')) {
    return {
      bg: themeStore.dark ? 'bg-emerald-600/20 border border-emerald-500/30' : 'bg-emerald-100',
      text: themeStore.dark ? 'text-emerald-400' : 'text-emerald-600'
    }
  }
  if (operationLower.includes('eliminación')) {
    return {
      bg: themeStore.dark ? 'bg-red-600/20 border border-red-500/30' : 'bg-red-100',
      text: themeStore.dark ? 'text-red-400' : 'text-red-600'
    }
  }
  if (operationLower.includes('movimiento')) {
    return {
      bg: themeStore.dark ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-blue-100',
      text: themeStore.dark ? 'text-blue-400' : 'text-blue-600'
    }
  }
  if (operationLower.includes('entrenamiento')) {
    return {
      bg: themeStore.dark ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-purple-100',
      text: themeStore.dark ? 'text-purple-400' : 'text-purple-600'
    }
  }
  return {
    bg: themeStore.dark ? 'bg-gray-600/20 border border-gray-500/30' : 'bg-gray-100',
    text: themeStore.dark ? 'text-gray-400' : 'text-gray-600'
  }
}

const getOperationDescription = (log: AuditLog): string => {
  const operationLower = log.operation.toLowerCase()

  if (operationLower.includes('subida')) {
    return `Se subió el documento "${log.document_filename}" a la categoría ${log.category}`
  }
  if (operationLower.includes('eliminación')) {
    return `Se eliminó el documento "${log.document_filename}" de la categoría ${log.category}`
  }
  if (operationLower.includes('movimiento')) {
    return `Se movió el documento "${log.document_filename}" de ${log.from_category} a ${log.to_category}`
  }
  if (operationLower.includes('entrenamiento')) {
    return `Se creó una nueva categoría "${log.data?.category}" con contenido de entrenamiento`
  }

  return `${log.operation} realizada en el sistema`
}

const formatFullTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchAllLogs = async () => {
  try {
    isLoading.value = true
    console.log('🔍 Fetching all audit logs...')
    const response = await AuditService.getAllAuditLogs()
    console.log('📊 All audit logs response:', response)
    logs.value = response || []
    console.log('✅ All logs loaded:', logs.value.length, 'items')
  } catch (error) {
    console.error('❌ Error fetching audit logs:', error)
    logs.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAllLogs()
})
</script>
