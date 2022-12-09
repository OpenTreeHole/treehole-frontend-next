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

const route = useRoute()

const router = useRouter()

const styleStore = useStyleStore()
const divisionStore = useDivisionStore()
const userStore = useUserStore()
router.beforeEach(async () => {
  await Promise.all([divisionStore.fetchDivisions(), userStore.fetchUser()])
  // scroll to top of page
  window.scrollTo(0, 0)
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
