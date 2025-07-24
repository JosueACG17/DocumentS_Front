import { defineStore } from 'pinia'
import { DocumentService } from '@/services/DocumentService'
import type { DocumentData } from '@/types/apiresponse'

interface State {
  documents: DocumentData[]
  loading: boolean
  error: string | null
}

export const useDocumentsStore = defineStore('documents', {
  state: (): State => ({
    documents: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDocuments() {
      this.loading = true
      this.error = null
      try {
        const documents = await DocumentService.getAllDocuments()
        console.log('Respuesta API documentos:', documents)
        this.documents = documents
      } catch (err) {
        this.error =
          typeof err === 'string' ? err : (err as Error)?.message || 'Error al obtener documentos'
      } finally {
        this.loading = false
      }
    },
  },
})
