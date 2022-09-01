import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Division } from '@/types'

export const useStore = defineStore('counter', () => {
  const divisions = reactive<Division[]>([])
  const currentDivisionId = ref<number | null>(null)
  return { divisions, currentDivisionId }
})
