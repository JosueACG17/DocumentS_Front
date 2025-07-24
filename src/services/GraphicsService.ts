import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'

export const GraphicsService = {
  // GET /text/graph/text/graph - Obtener gráfica de clusters de texto
  getTextClusterGraph(config?: AxiosRequestConfig) {
    return genericRequest.get<any>('/text/graph/text/graph', config)
  },
}
