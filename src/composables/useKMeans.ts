import { ref, computed, type Ref } from 'vue'
import type { KMeansCluster } from '@/types'
import { GraphicsService } from '@/services/GraphicsService'
interface TrainResponse {
  message: string
  clusters: Array<{
    _id: number
    docs: string[]
  }>
}

interface ClusterData {
  _id: number
  docs: string[]
}

export function useKMeans() {
  const isAnalyzing: Ref<boolean> = ref(false)
  const kmeansStatus: Ref<string> = ref('Listo para análisis')
  const kmeansResults: Ref<KMeansCluster[]> = ref([])
  const graphData: Ref<string | null> = ref(null) // URL de la imagen

  const kmeansStatusColor = computed((): string => {
    switch (kmeansStatus.value) {
      case 'Entrenando modelo...':
        return 'bg-yellow-400 animate-pulse'
      case 'Obteniendo gráfica...':
        return 'bg-blue-400 animate-pulse'
      case 'Completado':
        return 'bg-green-400'
      case 'Error':
        return 'bg-red-400'
      default:
        return 'bg-gray-400'
    }
  })

  const getClusterColor = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-red-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-pink-500',
    ]
    return colors[index % colors.length]
  }

  const runKMeansAnalysis = async (): Promise<void> => {
    try {
      isAnalyzing.value = true
      kmeansStatus.value = 'Entrenando modelo...'

      const trainResponse = await GraphicsService.trainKMeans()
      console.log('Modelo entrenado:', trainResponse)

      kmeansStatus.value = 'Obteniendo gráfica...'
      const graphResponse = await GraphicsService.getTextClusterGraph()
      if (graphResponse instanceof Blob) {
        const imageUrl = window.URL.createObjectURL(graphResponse)
        graphData.value = imageUrl
      }

      if (trainResponse && typeof trainResponse === 'object' && 'clusters' in trainResponse) {
        const clusters = (trainResponse as TrainResponse).clusters
        const processedResults = clusters.map((cluster: ClusterData, index: number) => ({
          count: cluster.docs?.length || 0,
          description: `Grupo ${cluster._id + 1} - ${cluster.docs?.length || 0} documentos`,
          keywords:
            cluster.docs?.slice(0, 3).map((doc: string) => doc.split('.')[0].split(' ')[0]) || [],
          color: getClusterColor(index),
        }))
        kmeansResults.value = processedResults
      }

      kmeansStatus.value = 'Completado'
    } catch (error) {
      console.error('Error en análisis K-means:', error)
      kmeansStatus.value = 'Error'
    } finally {
      isAnalyzing.value = false
    }
  }

  const clearGraphData = (): void => {
    if (graphData.value) {
      window.URL.revokeObjectURL(graphData.value)
      graphData.value = null
    }
  }

  return {
    isAnalyzing,
    kmeansStatus,
    kmeansResults,
    kmeansStatusColor,
    graphData,
    runKMeansAnalysis,
    clearGraphData,
  }
}
