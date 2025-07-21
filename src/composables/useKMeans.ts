import { ref, computed, type Ref } from "vue"
import type { KMeansCluster } from "@/types"

export function useKMeans() {
  const isAnalyzing: Ref<boolean> = ref(false)
  const kmeansStatus: Ref<string> = ref("Listo para análisis")

  const kmeansResults: Ref<KMeansCluster[]> = ref([
    {
      count: 312,
      description: "Documentos con terminología técnica y especificaciones",
      keywords: ["API", "desarrollo", "código", "sistema"],
      color: "bg-blue-500",
    },
    {
      count: 298,
      description: "Documentos legales y contractuales",
      keywords: ["contrato", "legal", "términos", "condiciones"],
      color: "bg-red-500",
    },
    {
      count: 267,
      description: "Informes y análisis financieros",
      keywords: ["financiero", "análisis", "presupuesto", "costos"],
      color: "bg-green-500",
    },
    {
      count: 370,
      description: "Documentación académica y educativa",
      keywords: ["investigación", "estudio", "análisis", "educación"],
      color: "bg-purple-500",
    },
  ])

  const kmeansStatusColor = computed((): string => {
    switch (kmeansStatus.value) {
      case "Analizando...":
        return "bg-yellow-400 animate-pulse"
      case "Completado":
        return "bg-green-400"
      case "Error":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  })

  const runKMeansAnalysis = (): void => {
    isAnalyzing.value = true
    kmeansStatus.value = "Analizando..."

    setTimeout(() => {
      isAnalyzing.value = false
      kmeansStatus.value = "Completado"
    }, 3000)
  }

  return {
    isAnalyzing,
    kmeansStatus,
    kmeansResults,
    kmeansStatusColor,
    runKMeansAnalysis,
  }
}
