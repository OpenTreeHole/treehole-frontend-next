import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { Division } from '@/types'
import { useTheme } from 'vuetify'

export const useStore = defineStore('counter', () => {
  const theme = useTheme()
  const divisions = reactive<Division[]>([])
  const currentDivisionId = ref<number | null>(null)
  const dark = ref<boolean>(false)
  watch(dark, () => {
    theme.global.name.value = dark.value ? 'dark' : 'light'
  })
  return { divisions, currentDivisionId, dark }
})
