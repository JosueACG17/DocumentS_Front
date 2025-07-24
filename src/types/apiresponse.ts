export interface DocumentData {
  filename: string
  categories: string[]
  content: string
  filepath: string
  cluster: number | null
}

export type DocumentApiResponse = DocumentData[]
