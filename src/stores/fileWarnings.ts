import { defineStore } from 'pinia'
import { ref } from 'vue'

interface FileWarning {
  filename: string
  message: string
  timestamp: string
  fromCategory: string
  toCategory: string
}

export const useFileWarningsStore = defineStore('fileWarnings', () => {
  // Estado
  const warnings = ref<Record<string, FileWarning>>({}) // filename -> FileWarning

  // Acciones
  function addWarning(filename: string, message: string, fromCategory: string, toCategory: string) {
    warnings.value[filename] = {
      filename,
      message,
      timestamp: new Date().toISOString(),
      fromCategory,
      toCategory,
    }

    // Guardar en localStorage para persistencia
    saveToLocalStorage()
  }

  function removeWarning(filename: string) {
    delete warnings.value[filename]
    saveToLocalStorage()
  }

  function clearAllWarnings() {
    warnings.value = {}
    saveToLocalStorage()
  }

  function hasWarning(filename: string): boolean {
    return filename in warnings.value
  }

  function getWarning(filename: string): FileWarning | undefined {
    return warnings.value[filename]
  }

  function getAllWarnings(): FileWarning[] {
    return Object.values(warnings.value)
  }

  // Persistencia en localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('fileWarnings', JSON.stringify(warnings.value))
    } catch (error) {
      console.error('Error al guardar advertencias en localStorage:', error)
    }
  }

  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('fileWarnings')
      if (stored) {
        warnings.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error al cargar advertencias desde localStorage:', error)
      warnings.value = {}
    }
  }

  // Inicialización
  function init() {
    loadFromLocalStorage()
    // Limpiar advertencias antiguas (más de 30 días)
    cleanupOldWarnings()
  }

  // Limpieza automática de advertencias antiguas
  function cleanupOldWarnings() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    Object.keys(warnings.value).forEach((filename) => {
      const warning = warnings.value[filename]
      const warningDate = new Date(warning.timestamp)

      if (warningDate < thirtyDaysAgo) {
        delete warnings.value[filename]
      }
    })

    saveToLocalStorage()
  }

  // Getter computados
  function getWarningsCount(): number {
    return Object.keys(warnings.value).length
  }

  function getWarningsByCategory(category: string): FileWarning[] {
    return Object.values(warnings.value).filter(
      (warning) => warning.fromCategory === category || warning.toCategory === category,
    )
  }

  return {
    // Estado
    warnings,

    // Acciones
    addWarning,
    removeWarning,
    clearAllWarnings,
    hasWarning,
    getWarning,
    getAllWarnings,
    init,

    // Getters
    getWarningsCount,
    getWarningsByCategory,

    // Utilidades
    saveToLocalStorage,
    loadFromLocalStorage,
    cleanupOldWarnings,
  }
})
