<template>
  <v-container class="mx-0 px-0 pt-0">
    <div class="flex">
      <div class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%]">
        <div class="border-b-sm flex justify-between">
          <v-tabs
            v-model="tab"
            background-color="primary"
          >
            <v-tab
              v-for="(adminRoute, i) in adminRoutes"
              :key="i"
              :value="adminRoute.name"
            >
              <span class="text-[15px] font-bold">{{ adminRoute.meta?.title }}</span>
            </v-tab>
          </v-tabs>
        </div>
      </div>
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
  </v-container>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ref } from 'vue'
import { adminRoutes } from '@/router'

const tab = ref(adminRoutes[0].meta?.title)
</script>

<style scoped></style>
