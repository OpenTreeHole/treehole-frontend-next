import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Division } from '@/types'

export const useStore = defineStore('counter', () => {
  const divisions = reactive<Division[]>([])
  return { divisions }
})
