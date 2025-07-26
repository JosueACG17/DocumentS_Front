<template>
  <div v-if="visible"
    class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
    <div :class="[
      themeStore.dark
        ? 'bg-neutral-800 text-white border-white/10'
        : 'bg-white text-neutral-800 border-gray-200',
      'rounded-xl p-6 w-full max-w-md border shadow-2xl relative transform transition-all duration-300 scale-100',
      'max-h-[90vh] overflow-y-auto'
    ]">
      <!-- Close Button -->
      <button @click="$emit('close')" :class="[
        themeStore.dark
          ? 'hover:bg-neutral-700 text-neutral-300'
          : 'hover:bg-gray-100 text-gray-500',
        'absolute top-4 right-4 p-1 rounded-full transition-colors cursor-pointer'
      ]">
        <X class="w-5 h-5" />
      </button>

      <!-- Header -->
      <div class="flex items-start mb-6">
        <div class="p-2 rounded-lg" :class="iconBgClass">
          <component :is="headerIcon" class="w-6 h-6" :class="iconColorClass" />
        </div>
        <div class="ml-3">
          <h3 class="text-xl font-bold">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm opacity-80 mt-1">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Content Slot -->
      <div class="space-y-4">
        <slot></slot>
      </div>

      <!-- Actions Slot -->
      <div v-if="$slots.actions" class="mt-6">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  visible: boolean
  title: string
  subtitle?: string
  headerIcon: unknown
  iconColor?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue'
})

defineEmits<{
  close: []
}>()

const themeStore = useThemeStore()

const iconBgClass = computed(() => {
  const colorMap = {
    blue: themeStore.dark ? 'bg-blue-900/30' : 'bg-blue-100',
    green: themeStore.dark ? 'bg-green-900/30' : 'bg-green-100',
    red: themeStore.dark ? 'bg-red-900/30' : 'bg-red-100',
    yellow: themeStore.dark ? 'bg-yellow-900/30' : 'bg-yellow-100',
    purple: themeStore.dark ? 'bg-purple-900/30' : 'bg-purple-100'
  }
  return colorMap[props.iconColor]
})

const iconColorClass = computed(() => {
  const colorMap = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500'
  }
  return colorMap[props.iconColor]
})
</script>
