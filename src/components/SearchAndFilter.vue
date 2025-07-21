<template>
  <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Buscar documentos..."
          class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent">
      </div>
      <select v-model="filterExtension"
        class=" text-white px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400">
        <option class="bg-black text-white" value="">Todas las extensiones</option>
        <option class="bg-black text-white" value="pdf">PDF</option>
        <option class="bg-black text-white" value="docx">DOCX</option>
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

const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value) => emit('update:searchQuery', value)
})

const filterExtension = computed({
  get: () => props.filterExtension,
  set: (value) => emit('update:filterExtension', value)
})
</script>
