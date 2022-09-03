<template>
  <v-app>
    <the-layout>
      <router-view :key="route.fullPath"></router-view>
    </the-layout>
  </v-app>
</template>

<script
  setup
  lang="ts"
>
import { useRoute, useRouter } from 'vue-router'
import TheLayout from './components/TheLayout.vue'
import { useStore } from '@/store'
import { listDivisions } from '@/apis'

const route = useRoute()

const router = useRouter()

const store = useStore()
router.beforeEach(async () => {
  // Get division data
  const localDivisions = localStorage.getItem('divisions')
  if (localDivisions) {
    store.divisions = JSON.parse(localDivisions)
    listDivisions().then((divisions) => {
      store.divisions = divisions
      localStorage.setItem('divisions', JSON.stringify(divisions))
    })
  } else {
    const divisions = await listDivisions()
    store.divisions = divisions
    localStorage.setItem('divisions', JSON.stringify(divisions))
  }
})

store.dark = window.matchMedia('(prefers-color-scheme: dark)').matches

window.matchMedia('(prefers-color-scheme: dark)').onchange = () => {
  store.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
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
