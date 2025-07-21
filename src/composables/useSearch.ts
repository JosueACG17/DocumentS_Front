import { ref, computed, type Ref } from "vue"
import type { Document } from "@/types"

export function useSearch(documents: Ref<Document[]>, categories: Ref<any[]>) {
  const searchQuery: Ref<string> = ref("")
  const filterExtension: Ref<string> = ref("")
  const selectedCategory: Ref<number | null> = ref(null)

  const filteredDocuments = computed((): Document[] => {
    let filtered = documents.value

    if (searchQuery.value) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          doc.category.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    }

    if (filterExtension.value) {
      filtered = filtered.filter((doc) => doc.extension === filterExtension.value)
    }

    if (selectedCategory.value) {
      const categoryName = categories.value.find((cat) => cat.id === selectedCategory.value)?.name
      if (categoryName) {
        filtered = filtered.filter((doc) => doc.category === categoryName)
      }
    }

    return filtered
  })

  const searchDocuments = (): void => {
    console.log("Searching documents...", {
      searchQuery: searchQuery.value,
      filterExtension: filterExtension.value,
    })
  }

  const selectCategory = (categoryId: number): void => {
    selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
  }

  return {
    searchQuery,
    filterExtension,
    selectedCategory,
    filteredDocuments,
    searchDocuments,
    selectCategory,
  }
}
