import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'

export const CategoriesService = {
  // GET /categories - Obtener todas las categorías
  getAllCategories(config?: AxiosRequestConfig) {
    return genericRequest.get<string[]>('/categories', config)
  },
}
