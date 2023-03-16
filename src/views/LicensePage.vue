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
              v-for="(license, i) in licenses"
              :key="i"
              :value="license.name"
            >
              <span class="text-[15px] font-bold">{{ license.name }}</span>
            </v-tab>
          </v-tabs>
        </div>
      </div>
    </div>
    <v-window v-model="tab">
      <v-window-item
        v-for="(license, i) in licenses"
        :key="i"
        :value="license.name"
      >
        <LicenseViewer :license="license" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts" setup>
import LicenseViewer from '@/components/license/LicenseViewer.vue'
import axios from '@/apis'
import { onMounted, ref } from 'vue'

const licenses = ref<{ name: string; file: string; type: 'pdf' }[]>([])

const tab = ref<string | null>(null)

const fetchLicenses = async () => {
  const response = await fetch('/licenses/index.json', { cache: 'no-store' })
  licenses.value = await response.json()
}

onMounted(async () => {
  await fetchLicenses()
  if (licenses.value.length > 0) tab.value = licenses.value[0].name
})
</script>

<style scoped lang="scss"></style>
