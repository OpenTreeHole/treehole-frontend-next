<template>
  <v-app>
    <the-layout>
      <router-view :key="route.fullPath"></router-view>
    </the-layout>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TheLayout from './components/TheLayout.vue'
import {
  useDivisionStore,
  useSettingsStore,
  useStyleStore,
  useTagStore,
  useUserStore
} from '@/store'
import { ref } from 'vue'
import { useNotification } from './composables/notification'

const route = useRoute()

const router = useRouter()

const styleStore = useStyleStore()
const divisionStore = useDivisionStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const tagStore = useTagStore()

const not = useNotification()

const firstRoute = ref(true)

router.beforeEach(async () => {
  sessionStorage.setItem(`scroll-${route.path}`, window.scrollY.toString())
})

router.beforeResolve(async (to) => {
  if (to.meta.requiresAuth) {
    const promise = Promise.all([
      divisionStore.fetchDivisions(),
      userStore.fetchUser(),
      userStore.fetchMessages(),
      tagStore.fetchTags()
    ])
    if (firstRoute.value) {
      firstRoute.value = false
      await userStore.fetchFavorites()
      await promise
    }
  }

  if (to.meta.isAdmin && !userStore.isAdmin) {
    not.error('管理者権限がありません')
    return false
  }

  divisionStore.currentDivisionId = null
})

router.afterEach(() => {
  window.scrollTo(0, +(sessionStorage.getItem(`scroll-${route.path}`) || 0))
})

if (settingsStore.forceTheme) {
  styleStore.dark = settingsStore.forceTheme === 'dark'
} else {
  styleStore.dark = window.matchMedia('(prefers-color-scheme: dark)').matches

  window.matchMedia('(prefers-color-scheme: dark)').onchange = () => {
    styleStore.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
