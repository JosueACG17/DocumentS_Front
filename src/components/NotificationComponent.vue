<template>
  <transition name="fade-slide">
    <div
      v-if="visible"
      :class="[
        'fixed top-21 z-50 w-full max-w-sm flex items-center gap-4 px-6 py-5 rounded-3xl shadow-2xl backdrop-blur-md border-2 transition-all duration-300',
        bgClass,
        borderClass
      ]"
    >
      <div
        :class="[
          iconBg,
          'min-w-[56px] min-h-[56px] rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300'
        ]"
      >
        <component :is="icon" class="w-7 h-7 text-white" />
      </div>
      <div class="flex-1">
        <div :class="['font-semibold text-base mb-1', textClass]">{{ title }}</div>
        <div :class="['text-sm leading-snug', textClass]">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-vue-next'

const themeStore = useThemeStore()

interface Props {
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}
const props = defineProps<Props>()
const emit = defineEmits(['close'])

const visible = ref(true)

const type = computed(() => props.type || 'info')
const title = computed(() => {
  switch (type.value) {
    case 'success': return '¡Éxito!'
    case 'error': return 'Error'
    case 'info': return 'Información'
    case 'warning': return 'Advertencia'
    default: return 'Notificación'
  }
})
const icon = computed(() => {
  switch (type.value) {
    case 'success': return CheckCircle
    case 'error': return XCircle
    case 'info': return Info
    case 'warning': return AlertTriangle
    default: return Info
  }
})
const iconBg = computed(() => {
  switch (type.value) {
    case 'success': return 'bg-gradient-to-br from-green-500 to-emerald-500'
    case 'error': return 'bg-gradient-to-br from-red-500 to-pink-500'
    case 'info': return 'bg-gradient-to-br from-blue-500 to-cyan-500'
    case 'warning': return 'bg-gradient-to-br from-yellow-400 to-orange-500'
    default: return 'bg-gradient-to-br from-blue-500 to-cyan-500'
  }
})
const bgClass = computed(() =>
  themeStore.dark ? 'bg-white/10' : 'bg-white/60'
)

const borderClass = computed(() => {
  if (themeStore.dark) {
    switch (type.value) {
      case 'success': return 'border-green-400/30'
      case 'error': return 'border-red-400/30'
      case 'info': return 'border-blue-400/30'
      case 'warning': return 'border-yellow-400/30'
      default: return 'border-white/10'
    }
  } else {
    switch (type.value) {
      case 'success': return 'border-green-300'
      case 'error': return 'border-red-300'
      case 'info': return 'border-blue-300'
      case 'warning': return 'border-yellow-300'
      default: return 'border-blue-300'
    }
  }
})

const textClass = computed(() => themeStore.dark ? 'text-white' : 'text-gray-800')

function close() {
  visible.value = false
  emit('close')
}

if (props.duration && props.duration > 0) {
  watch(
    visible,
    (v) => {
      if (v) {
        setTimeout(() => close(), props.duration)
      }
    },
    { immediate: true }
  )
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
