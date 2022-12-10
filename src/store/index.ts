import { defineStore } from 'pinia'
import { reactive, ref, watch, computed } from 'vue'
import { Division, Hole, Tag, UserAuth } from '@/types'
import { useTheme } from 'vuetify'
import { getCurrentUser, listDivisions, listHoles } from '@/apis'

export const useStyleStore = defineStore('style', () => {
  const theme = useTheme()

  const dark = ref<boolean>(false)
  watch(dark, () => {
    theme.global.name.value = dark.value ? 'dark' : 'light'
  })
  return { dark }
})

export const useDivisionStore = defineStore('division', () => {
  const divisions = reactive<Division[]>([])
  const currentDivisionId = ref<number | null>(null)
  function updateDivision(newDivisions: Division[]) {
    divisions.splice(0, divisions.length, ...newDivisions)
    localStorage.setItem('divisions', JSON.stringify(divisions))
  }

  async function fetchDivisions() {
    const localDivisions = localStorage.getItem('divisions')
    if (localDivisions) {
      updateDivision(JSON.parse(localDivisions))
      listDivisions().then((newDivisions) => {
        updateDivision(newDivisions)
      })
    } else {
      updateDivision(await listDivisions())
    }
  }

  const getDivisionById = computed(() => (id: number) => {
    return divisions.find((division) => division.id === id)
  })
  return { divisions, fetchDivisions, getDivisionById, currentDivisionId }
})

export const useUserStore = defineStore('user', () => {
  const user = ref<UserAuth | null>(null)
  async function fetchUser() {
    user.value = await getCurrentUser()
  }
  return { user, fetchUser }
})

export const useHoleStore = defineStore('hole', () => {
  const holes = reactive<Map<number, Hole[]>>(new Map())
  const getHolesByDivisionId = computed(() => (divisionId: number) => {
    return holes.get(divisionId) || []
  })

  const getHoleById = computed(() => (id: number) => {
    for (const divisionHoles of holes.values()) {
      const hole = divisionHoles.find((hole) => hole.id === id)
      if (hole) {
        return hole
      }
    }
    return null
  })

  async function fetchDivisionHoles(
    divisionId: number,
    length = 10,
    tag?: string | Tag
  ): Promise<boolean> {
    if (!holes.has(divisionId)) {
      holes.set(divisionId, [])
    }
    const oldHoles = holes.get(divisionId)!
    const time = oldHoles.length > 0 ? oldHoles[oldHoles.length - 1].timeUpdated : new Date()
    const newHoles = await listHoles(divisionId, time, length, tag)
    if (newHoles.length === 0) {
      return false
    }
    // Push new holes while keeping the time order (new to old), and remove old duplicates
    for (const newHole of newHoles) {
      const index = oldHoles.findIndex((hole) => hole.id === newHole.id)
      if (index >= 0) {
        oldHoles.splice(index, 1)
      }
      oldHoles.push(newHole)
    }
    oldHoles.sort((a, b) => b.timeUpdated.getTime() - a.timeUpdated.getTime())
    return true
  }
  return { holes, fetchDivisionHoles, getHolesByDivisionId, getHoleById }
})
