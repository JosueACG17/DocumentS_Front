import { FileText } from 'lucide-vue-next'
import type { FileIcon } from '@/types'

export const getFileIcon = (extension: string): FileIcon => {
  switch (extension) {
    case 'pdf':
      return { icon: FileText, bg: 'bg-gradient-to-r from-red-500 to-pink-500' }
    case 'docx':
      return { icon: FileText, bg: 'bg-gradient-to-r from-blue-500 to-indigo-500' }
    default:
      return { icon: FileText, bg: 'bg-gradient-to-r from-gray-500 to-gray-600' }
  }
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
