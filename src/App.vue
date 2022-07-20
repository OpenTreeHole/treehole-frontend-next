<template>
  <v-app>
    <the-layout>
      <v-main>
        <router-view :key="route.fullPath"></router-view>
      </v-main>
    </the-layout>
  </v-app>
</template>

<script
  setup
  lang="ts"
>
import { useRoute } from 'vue-router'
import TheLayout from './components/TheLayout.vue'

const route = useRoute()
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
