// utils/useSearch.ts
import { ref } from 'vue'

export function useSearch() {
  const searchQuery = ref('')

  function clearSearch() {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    clearSearch,
  }
}
