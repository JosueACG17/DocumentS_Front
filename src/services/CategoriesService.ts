import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'

interface TrainingExamplePayload {
  category: string
  text: string
}

export const CategoriesService = {
  // GET /categories - Obtener todas las categorías
  getAllCategories(config?: AxiosRequestConfig) {
    return genericRequest.get<string[]>('/categories', config)
  },

  // POST /training-new-example - Crear nuevo ejemplo de entrenamiento
  createTrainingExample(payload: TrainingExamplePayload, config?: AxiosRequestConfig) {
    return genericRequest.post<string>('/training-new-example', payload, config)
  },

  // GET /texts/{category} - Obtener textos por categoría
  getTextsByCategory(category: string, config?: AxiosRequestConfig) {
    return genericRequest.get<string[]>(`/texts/${category}`, config)
  },
}
