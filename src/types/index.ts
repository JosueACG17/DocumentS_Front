export interface Stat {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: unknown
  iconBg: string
  gradient: string
}

export interface Category {
  id: number
  name: string
  count: number
  icon: unknown
  iconBg: string
  gradient: string
  progressColor: string
}

export interface Document {
  id: number
  name: string
  category: string
  extension: string
  size: string
  date: string
}

export interface KMeansCluster {
  count: number
  description: string
  keywords: string[]
  color: string
}

export interface QuickAction {
  id: string
  label: string
  icon: unknown
  color: string
}

export interface FABAction {
  id: string
  label: string
  icon: unknown
  color: string
}

export interface FileIcon {
  icon: unknown
  bg: string
}

export type ViewMode = "list" | "grid"
