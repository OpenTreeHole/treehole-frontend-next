import { defineStore } from 'pinia'
import { reactive, ref, watch, computed } from 'vue'
import { Division, Hole, IDivisionModify, Tag, UserAuth } from '@/types'
import { useTheme } from 'vuetify'
import { getCurrentUser, listDivisions, listHoles, listTags } from '@/apis'
import * as api from '@/apis'

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
      const cachedDivisions = JSON.parse(localDivisions)
      // Parse the date string to Date object
      for (const division of cachedDivisions) {
        for (const hole of division.pinned) {
          hole.timeUpdated = new Date(hole.timeUpdated)
          hole.timeCreated = new Date(hole.timeCreated)
          hole.firstFloor.timeUpdated = new Date(hole.firstFloor.timeUpdated)
          hole.firstFloor.timeCreated = new Date(hole.firstFloor.timeCreated)
          hole.lastFloor.timeUpdated = new Date(hole.lastFloor.timeUpdated)
          hole.lastFloor.timeCreated = new Date(hole.lastFloor.timeCreated)
          for (const floor of hole.floors) {
            floor.timeUpdated = new Date(floor.timeUpdated)
            floor.timeCreated = new Date(floor.timeCreated)
          }
        }
      }
      updateDivision(cachedDivisions)
      listDivisions().then((newDivisions) => {
        updateDivision(newDivisions)
      })
    } else {
      updateDivision(await listDivisions())
    }
  }

  async function modifyDivision(id: number, division: IDivisionModify) {
    const newDivision = await api.modifyDivision(id, division)
    const index = divisions.findIndex((division) => division.id === id)
    if (index >= 0) {
      divisions.splice(index, 1, newDivision)
    }
  }

  const getDivisionById = computed(() => (id: number) => {
    return divisions.find((division) => division.id === id)
  })
  return { divisions, fetchDivisions, getDivisionById, currentDivisionId, modifyDivision }
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

  function clearHolesInDivision(divisionId: number) {
    holes.delete(divisionId)
  }

  function updateHole(hole: Hole) {
    // First remove the hole from all division
    for (const divisionHoles of holes.values()) {
      const index = divisionHoles.findIndex((h) => h.id === hole.id)
      if (index >= 0) {
        divisionHoles.splice(index, 1)
      }
    }
    // Then add the hole to the right division at the right position
    const divisionHoles = holes.get(hole.divisionId)
    if (divisionHoles) {
      const index = divisionHoles.findIndex(
        (h) => h.timeUpdated.getTime() < hole.timeUpdated.getTime()
      )
      if (index >= 0) {
        divisionHoles.splice(index, 0, hole)
      } else {
        divisionHoles.push(hole)
      }
    }
  }

  return {
    holes,
    fetchDivisionHoles,
    getHolesByDivisionId,
    getHoleById,
    clearHolesInDivision,
    updateHole
  }
})

export const useTagStore = defineStore('tag', () => {
  const tags = reactive<Tag[]>([])
  const localBlockedTags = localStorage.getItem('blockedTags')
  const _blockedTags = ref<Tag[]>(localBlockedTags ? JSON.parse(localBlockedTags) : [])
  const blockedTags = computed({
    get: () => _blockedTags.value,
    set: (tags: Tag[]) => {
      _blockedTags.value = tags
      localStorage.setItem('blockedTags', JSON.stringify(tags))
      console.log('blockedTags', tags)
    }
  })
  const fetchTags = async () => {
    tags.splice(0, tags.length, ...(await listTags()))
  }
  return { tags, _blockedTags, blockedTags, fetchTags }
})
