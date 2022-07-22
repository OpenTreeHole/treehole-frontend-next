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
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import TheLayout from './components/TheLayout.vue'
import { listDivisions } from '@/apis'
import { useStore } from '@/store'

const route = useRoute()
const store = useStore()

onBeforeRouteUpdate(async () => {
  // Get division data
  const divisions = await listDivisions()
  store.commit('setDivisions', { divisions })
})
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
