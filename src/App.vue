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
import { useDivisionStore, useStyleStore, useUserStore } from '@/store'
import { onMounted, ref } from 'vue'

const route = useRoute()

const router = useRouter()

const styleStore = useStyleStore()
const divisionStore = useDivisionStore()
const userStore = useUserStore()

const firstRoute = ref(true)

router.beforeEach(async () => {
  sessionStorage.setItem(`scroll-${route.path}`, window.scrollY.toString())

  const promise = Promise.all([divisionStore.fetchDivisions(), userStore.fetchUser()])
  if (firstRoute.value) {
    firstRoute.value = false
    await promise
  }
})

router.afterEach(() => {
  window.scrollTo(0, +(sessionStorage.getItem(`scroll-${route.path}`) || 0))
})

styleStore.dark = window.matchMedia('(prefers-color-scheme: dark)').matches

window.matchMedia('(prefers-color-scheme: dark)').onchange = () => {
  styleStore.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
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
