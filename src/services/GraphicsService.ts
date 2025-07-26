import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'

export const GraphicsService = {
  // GET /text/graph/text/graph - Obtener gráfica de clusters de texto
  getTextClusterGraph(config?: AxiosRequestConfig) {
    return genericRequest.get<Blob>('/text/graph/text/graph', {
      ...config,
      responseType: 'blob',
    })
  },

  // POST /train/ - Entrenar y clasificar K-means
  trainKMeans(config?: AxiosRequestConfig) {
    return genericRequest.post<string>('/train/', {}, config)
  },
}
