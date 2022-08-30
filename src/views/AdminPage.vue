<template>
  <v-container class="mx-0 px-0 pt-0">
    <div class="flex">
      <v-col class="max-w-[55%] px-0 py-0">
        <div class="text-h4 border-b-sm flex justify-between">
          <v-tabs
            v-model="tab"
            background-color="primary"
          >
            <v-tab
              v-for="(adminRoute, i) in adminRoutes"
              :key="i"
              :value="adminRoute.name"
            >
              {{ adminRoute.meta.title }}
            </v-tab>
          </v-tabs>
        </div>
        <v-window v-model="tab">
          <v-window-item
            v-for="(adminRoute, i) in adminRoutes"
            :key="i"
            :value="adminRoute.name"
          >
            <component :is="adminRoute.component" />
          </v-window-item>
        </v-window>
      </v-col>
    </div>
  </v-container>
</template>

<script
  setup
  lang="ts"
>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref } from 'vue'
import { adminRoutes } from '@/router'

const tab = ref(adminRoutes[0].meta?.title)
</script>

<style scoped></style>
