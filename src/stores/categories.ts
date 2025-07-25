import { defineStore } from 'pinia'
import { CategoriesService } from '@/services/CategoriesService'

interface State {
  categories: string[]
  loading: boolean
  error: string | null
}

export const useCategoriesStore = defineStore('categories', {
  state: (): State => ({
    categories: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const response = await CategoriesService.getAllCategories()
        this.categories = Array.isArray(response) ? response : (response?.data ?? [])
      } catch (err) {
        this.error =
          typeof err === 'string' ? err : (err as Error)?.message || 'Error al obtener categorías'
      } finally {
        this.loading = false
      }
    },
    addCategory(nombre: string) {
      if (!this.categories.includes(nombre)) {
        this.categories.push(nombre)
      }
    },
  },
})
