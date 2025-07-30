<template>
  <div :class="[
    'rounded-2xl border transition-all duration-300 shadow-lg hover:shadow-xl',
    themeStore.dark
      ? 'bg-neutral-800/80 border-neutral-700 backdrop-blur-sm'
      : 'bg-white border-gray-200 backdrop-blur-sm'
  ]">
    <!-- Header -->
    <div class="p-6 border-b" :class="themeStore.dark ? 'border-neutral-700' : 'border-gray-200'">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center',
            themeStore.dark
              ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30'
              : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
          ]">
            <History :class="[
              'w-6 h-6',
              themeStore.dark ? 'text-blue-400' : 'text-blue-600'
            ]" />
          </div>
          <div>
            <h3 :class="[
              'text-lg font-bold',
              themeStore.dark ? 'text-white' : 'text-gray-900'
            ]">
              Actividad Reciente
            </h3>
            <p :class="[
              'text-sm',
              themeStore.dark ? 'text-gray-400' : 'text-gray-500'
            ]">
              Últimas operaciones realizadas
            </p>
          </div>
        </div>

        <router-link to="/audit-logs" :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center space-x-2 hover:scale-105',
          themeStore.dark
            ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30'
            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
        ]">
          <span>Ver todo</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 6" :key="i" :class="[
          'animate-pulse flex items-center space-x-4 p-4 rounded-xl',
          themeStore.dark ? 'bg-neutral-700/50' : 'bg-gray-100/50'
        ]">
          <div :class="[
            'w-10 h-10 rounded-full',
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

      <!-- Logs List -->
      <div v-else-if="recentLogs.length > 0" class="space-y-3">
        <div v-for="log in recentLogs" :key="log._id" :class="[
          'flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer',
          themeStore.dark
            ? 'hover:bg-neutral-700/50 border border-neutral-700/90 bg-white/5'
            : 'hover:bg-gray-50 border border-gray-300'
        ]">
          <!-- Operation Icon -->
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            getOperationStyle(log.operation).bg
          ]">
            <component :is="getOperationIcon(log.operation)" :class="[
              'w-5 h-5',
              getOperationStyle(log.operation).text
            ]" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p :class="[
                  'text-sm font-medium truncate',
                  themeStore.dark ? 'text-white' : 'text-gray-900'
                ]">
                  {{ getOperationDescription(log) }}
                </p>
                <div class="flex items-center space-x-2 mt-1">
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full font-medium',
                    themeStore.dark
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'bg-blue-100 text-blue-700'
                  ]">
                    {{ log.username }}
                  </span>
                  <span :class="[
                    'text-xs',
                    themeStore.dark ? 'text-gray-400' : 'text-gray-500'
                  ]">
                    {{ formatTimestamp(log.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else :class="[
        'text-center py-8',
        themeStore.dark ? 'text-gray-400' : 'text-gray-500'
      ]">
        <History class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p class="text-sm">No hay actividad reciente</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { AuditService } from '@/services/AuditService'
import type { AuditLog } from '@/types/auditlog'
import {
  History,
  ArrowRight,
  Upload,
  Trash2,
  FolderOpen,
  Edit,
  FileText
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const isLoading = ref(true)
const logs = ref<AuditLog[]>([])

const recentLogs = computed(() => {
  return logs.value.slice(0, 6)
})

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
    return `Subió "${log.document_filename}" a ${log.category}`
  }
  if (operationLower.includes('eliminación')) {
    return `Eliminó "${log.document_filename}" de ${log.category}`
  }
  if (operationLower.includes('movimiento')) {
    return `Movió "${log.document_filename}" de ${log.from_category} a ${log.to_category}`
  }
  if (operationLower.includes('entrenamiento')) {
    return `Creó nueva categoría "${log.data?.category}"`
  }

  return log.operation
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const fetchRecentLogs = async () => {
  try {
    isLoading.value = true
    console.log('🔍 Fetching audit logs...')
    const response = await AuditService.getAllAuditLogs()
    console.log('📊 Audit logs response:', response)
    logs.value = response || []
    console.log('✅ Logs loaded:', logs.value.length, 'items')
  } catch (error) {
    console.error('❌ Error fetching audit logs:', error)
    logs.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRecentLogs()
})
</script>
