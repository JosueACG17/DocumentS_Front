<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
    <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
      <Zap class="w-5 h-5 mr-2 text-yellow-400" />
      Acciones Rápidas
    </h3>
    <div class="space-y-3">
      <button v-for="action in actions" :key="action.id"
              @click="$emit('actionExecuted', action.id)"
              class="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group">
        <div class="flex items-center">
          <component :is="action.icon" :class="action.color" class="w-5 h-5 mr-3" />
          <span class="text-white font-medium">{{ action.label }}</span>
        </div>
        <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Zap, ChevronRight } from 'lucide-vue-next'
import type { QuickAction } from '@/types'

interface Props {
  actions: QuickAction[]
}

interface Emits {
  (e: 'actionExecuted', actionId: string): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
