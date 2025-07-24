<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div v-for="(stat, index) in stats" :key="index" :class="[
      'group relative overflow-hidden rounded-2xl backdrop-blur-sm border p-6 transition-all duration-300 hover:scale-105',
      themeStore.dark
        ? 'bg-white/10 border-white/20 hover:bg-white/15'
        : 'bg-white border-gray-300 hover:bg-gray-100'
    ]">
      <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        :class="stat.gradient"></div>
      <div class="relative">
        <div class="flex items-center justify-between mb-4">
          <div :class="stat.iconBg" class="w-12 h-12 rounded-xl flex items-center justify-center">
            <component :is="stat.icon" class="w-6 h-6 text-white" />
          </div>
          <div
            :class="[stat.trend === 'up' ? 'text-green-400' : 'text-red-400', themeStore.dark ? 'text-sm font-medium' : 'text-sm font-medium']">
            {{ stat.change }}
          </div>
        </div>
        <div :class="['text-2xl font-bold mb-1', themeStore.dark ? 'text-white' : 'text-gray-900']">{{ stat.value }}
        </div>
        <div :class="['text-sm', themeStore.dark ? 'text-gray-400' : 'text-gray-500']">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stat } from '@/types'

import { useThemeStore } from '@/stores/theme'

interface Props {
  stats: Stat[]
}

defineProps<Props>()
const themeStore = useThemeStore()
</script>
