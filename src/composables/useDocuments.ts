import { ref, type Ref } from "vue"
import type { Document } from "@/types"

export function useDocuments() {
  const documents: Ref<Document[]> = ref([
    {
      id: 1,
      name: "Contrato_Servicios_2024.pdf",
      category: "Legales",
      extension: "pdf",
      size: "2.4 MB",
      date: "2 horas",
    },
    {
      id: 2,
      name: "Informe_Financiero_Q1.docx",
      category: "Financieros",
      extension: "docx",
      size: "1.8 MB",
      date: "5 horas",
    },
    {
      id: 3,
      name: "Manual_Usuario_v2.pdf",
      category: "Técnicos",
      extension: "pdf",
      size: "5.2 MB",
      date: "1 día",
    },
    {
      id: 4,
      name: "Tesis_Doctoral_Final.docx",
      category: "Académicos",
      extension: "docx",
      size: "12.7 MB",
      date: "2 días",
    },
    {
      id: 5,
      name: "Propuesta_Proyecto.pdf",
      category: "Corporativos",
      extension: "pdf",
      size: "3.1 MB",
      date: "3 días",
    },
  ])

  const addDocument = (file: File): void => {
    documents.value.unshift({
      id: Date.now(),
      name: file.name,
      category: "Sin categorizar",
      extension: file.name.split(".").pop() || "",
      size: (file.size / 1024 / 1024).toFixed(1) + " MB",
      date: "Ahora",
    })
  }

  const downloadDocument = (docId: number): void => {
    console.log("Downloading document:", docId)
    // Aquí iría la lógica de descarga
  }

  const viewDocument = (docId: number): void => {
    console.log("Viewing document:", docId)
    // Aquí iría la lógica de vista
  }

  return {
    documents,
    addDocument,
    downloadDocument,
    viewDocument,
  }
}
