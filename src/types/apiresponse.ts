export interface DocumentData {
  _id: string
  filename: string
  categories: string[]
  content: string
  filepath: string
  cluster: number | null
}

export type DocumentApiResponse = DocumentData[]
