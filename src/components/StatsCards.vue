<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
    <div v-for="(stat, index) in stats" :key="index" :class="[
      'group relative overflow-hidden rounded-3xl shadow-xl border p-8 transition-all duration-300 transform hover:scale-[1.04] hover:shadow-3xl',
      themeStore.dark
        ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 backdrop-blur-lg'
        : 'bg-gradient-to-br from-white/80 to-gray-100/80 border-gray-200 backdrop-blur-lg'
    ]" style="min-height: 220px;">
      <!-- Fondo brillante sutil -->
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none rounded-3xl"
        :class="stat.gradient"></div>

      <!-- Glow animado -->
      <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none"
        :class="stat.iconBg"></div>

      <div class="relative z-10 flex flex-col items-center gap-4">
        <!-- Ícono animado grande -->
        <div
          :class="[stat.iconBg, 'w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform transition-transform duration-300 ']">
          <component :is="stat.icon" class="w-8 h-8 text-white animate-bounce-slow" />
        </div>

        <!-- Valor destacado grande -->
        <div
          :class="['text-4xl font-black tracking-tight text-center', themeStore.dark ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-lg']">
          {{ stat.value }}
        </div>

        <!-- Etiqueta -->
        <div
          :class="['text-base font-semibold tracking-wide uppercase text-center', themeStore.dark ? 'text-gray-300' : 'text-gray-600']">
          {{ stat.label }}
        </div>
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

<style scoped>
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2.2s infinite;
}
</style>
