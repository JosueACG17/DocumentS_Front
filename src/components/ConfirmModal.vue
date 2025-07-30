<template>
  <div v-if="isOpen"
    class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
    <div
      :class="['rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-100 w-[90vw] max-w-md mx-4', themeStore.dark ? 'bg-neutral-800' : 'bg-white']">
      <!-- Header -->
      <div class="p-6 text-center">
        <div class="flex justify-center mb-4">
          <div :class="[
            'w-16 h-16 rounded-full flex items-center justify-center',
            type === 'success'
              ? (themeStore.dark ? 'bg-emerald-900/30' : 'bg-emerald-100')
              : (themeStore.dark ? 'bg-red-900/30' : 'bg-red-100')
          ]">
            <component :is="type === 'success' ? CheckCircle : AlertTriangle" :class="[
              'w-8 h-8',
              type === 'success'
                ? (themeStore.dark ? 'text-emerald-400' : 'text-emerald-600')
                : (themeStore.dark ? 'text-red-400' : 'text-red-600')
            ]" />
          </div>
        </div>

        <h3 :class="['text-xl font-bold mb-2', themeStore.dark ? 'text-white' : 'text-gray-900']">
          {{ title }}
        </h3>

        <p :class="['text-sm leading-relaxed', themeStore.dark ? 'text-gray-300' : 'text-gray-600']">
          {{ message }}
        </p>
      </div>

      <!-- Actions -->
      <div v-if="showCancel || showConfirm" class="px-6 pb-6 flex flex-col sm:flex-row gap-3">
        <button v-if="showCancel" @click="handleCancel"
          :class="['flex-1 px-4 py-3 cursor-pointer rounded-xl font-medium transition-colors duration-200', themeStore.dark ? 'bg-neutral-700 text-gray-300 hover:bg-neutral-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
          {{ cancelText }}
        </button>

        <button v-if="showConfirm" @click="handleConfirm" :class="[
          'flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-white cursor-pointer',
          type === 'success'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
            : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        ]">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, AlertTriangle } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

interface Props {
  isOpen: boolean
  type: 'success' | 'warning'
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  showConfirm?: boolean
}

interface Emits {
  confirm: []
  cancel: []
  close: []
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showCancel: true,
  showConfirm: true
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>
