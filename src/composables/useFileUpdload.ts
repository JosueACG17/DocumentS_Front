import { ref, type Ref } from "vue"

export function useFileUpload() {
  const uploadProgress: Ref<number> = ref(0)
  const fileInput: Ref<HTMLInputElement | null> = ref(null)

  const triggerFileUpload = (): void => {
    fileInput.value?.click()
  }

  const simulateUpload = (file: File, onComplete?: (file: File) => void): void => {
    uploadProgress.value = 0
    const interval = setInterval(() => {
      uploadProgress.value += Math.random() * 15
      if (uploadProgress.value >= 100) {
        uploadProgress.value = 100
        clearInterval(interval)
        setTimeout(() => {
          uploadProgress.value = 0
          onComplete?.(file)
        }, 1000)
      }
    }, 200)
  }

  const handleFileUpload = (event: Event, onComplete?: (file: File) => void): void => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      simulateUpload(file, onComplete)
    }
  }

  const handleFileDrop = (event: DragEvent, onComplete?: (file: File) => void): void => {
    const file = event.dataTransfer?.files[0]
    if (file) {
      simulateUpload(file, onComplete)
    }
  }

  return {
    uploadProgress,
    fileInput,
    triggerFileUpload,
    handleFileUpload,
    handleFileDrop,
  }
}
