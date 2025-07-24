import { genericRequest } from '@/api/GenericRequest'
import type { AxiosRequestConfig } from 'axios'
import type { DocumentApiResponse } from '@/types/apiresponse'

export const DocumentService = {
  // POST /upload/ - Subir documento
  uploadDocument(formData: FormData, config?: AxiosRequestConfig) {
    return genericRequest.post<DocumentApiResponse>('/upload/', formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // GET /upload/documents - Obtener todos los documentos
  getAllDocuments(config?: AxiosRequestConfig) {
    return genericRequest.get<DocumentApiResponse>('/upload/documents', config)
  },

  // GET /upload/by-category/{category} - Documentos por categoría
  getDocumentsByCategory(category: string, config?: AxiosRequestConfig) {
    return genericRequest.get<DocumentApiResponse[]>(`/upload/by-category/${category}`, config)
  },

  // DELETE /upload/documents/{doc_id} - Eliminar documento
  deleteDocument(docId: string | number, config?: AxiosRequestConfig) {
    // Si la API responde con un mensaje, podrías tipar como { detail: string }, pero si no, void
    return genericRequest.delete<void>(`/upload/documents/${docId}`, config)
  },

  // GET /upload/download/file/?filename=... - Descargar archivo por nombre
  downloadFileByName(filename: string, config?: AxiosRequestConfig) {
    return genericRequest.get<Blob>(
      `/upload/download/file/?filename=${encodeURIComponent(filename)}`,
      {
        ...config,
        responseType: 'blob',
      },
    )
  },

  // GET /upload/download/zip/{category} - Descargar zip de categoría
  downloadCategoryZip(category: string, config?: AxiosRequestConfig) {
    return genericRequest.get<Blob>(`/upload/download/zip/${category}`, {
      ...config,
      responseType: 'blob',
    })
  },

  // GET /upload/download/all - Descargar todos los documentos (zip)
  downloadAllDocuments(config?: AxiosRequestConfig) {
    return genericRequest.get<Blob>('/upload/download/all', {
      ...config,
      responseType: 'blob',
    })
  },
}
