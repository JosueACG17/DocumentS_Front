<template>
  <div :class="[
    'rounded-2xl backdrop-blur-sm border p-6 mb-6 transition-colors duration-300',
    themeStore.dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'
  ]">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          :class="themeStore.dark ? 'text-gray-400' : 'text-gray-500'" />
        <input v-model="searchQuery" type="text" placeholder="Buscar documentos..." :class="[
          'w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-colors duration-300',
          themeStore.dark
            ? 'bg-white/10 border border-white/20 text-white placeholder-gray-400'
            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500'
        ]">
      </div>
      <select v-model="filterExtension" :class="[
        'px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors duration-300',
        themeStore.dark ? 'bg-white/10 border border-white/20 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'
      ]">
        <option :class="themeStore.dark ? 'bg-black text-white' : 'bg-white text-gray-900'" value="">Todas las
          extensiones</option>
        <option :class="themeStore.dark ? 'bg-black text-white' : 'bg-white text-gray-900'" value="pdf">PDF</option>
        <option :class="themeStore.dark ? 'bg-black text-white' : 'bg-white text-gray-900'" value="docx">DOCX</option>
      </select>

      <button @click="$emit('search')"
        class="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center">
        <Search class="w-4 h-4 mr-2" />
        Buscar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'
import { Search } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  searchQuery: string
  filterExtension: string
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:filterExtension', value: string): void
  (e: 'search'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const themeStore = useThemeStore()

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value)
})

const filterExtension = computed({
  get: () => props.filterExtension,
  set: (value) => emit('update:filterExtension', value)
})
</script>
