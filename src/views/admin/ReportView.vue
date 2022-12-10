<template>
  <div class="flex">
    <div class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%] grow">
      <v-list class="pt-0 lg:px-4">
        <v-list-item
          v-for="(report, i) in reports"
          :key="i"
          v-intersect="onIntersect(i)"
          class="px-0 py-5 border-b-sm flex-col text-left"
        >
          <ReportBlock
            v-model:report="reports[i]"
            class="px-6"
            @deal="onDeal(i)"
          />
        </v-list-item>
      </v-list>
    </div>
    <div class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5 lg:pt-4 grow">
      <v-list class="pt-0 lg:pt-4">
        <v-list-item>
          <p class="text-left">举报类别：</p>
          <v-radio-group v-model="range">
            <v-radio
              label="未处理举报"
              :value="0"
            ></v-radio>
            <v-radio
              label="已处理举报"
              :value="1"
            ></v-radio>
            <v-radio
              label="所有举报"
              :value="2"
            ></v-radio>
          </v-radio-group>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Report } from '@/types'
import ReportBlock from '@/components/floor/ReportBlock.vue'
import { listReports } from '@/apis'
import { onMounted, provide, reactive, ref, watch } from 'vue'
import { useFloorPortal } from '@/composables/floor'

const { gotoFloor } = useFloorPortal()

provide('scrollToFloor', gotoFloor)

const reports = reactive<Report[]>([])

const range = ref<0 | 1 | 2>(0)

const hasNext = ref(true)
const loading = ref(false)
const loadEnd = ref(0)

const loadReportsUntil = async (length: number) => {
  loadEnd.value = length
  if (loading.value) return
  loading.value = true
  while (reports.length < loadEnd.value && hasNext.value) {
    const res = await listReports(reports.length, 10, range.value)
    if (res.length < 10) hasNext.value = false
    reports.push(...res)
  }
  loading.value = false
}

const onIntersect = (index: number) => async (isIntersecting: boolean) => {
  if (isIntersecting && index >= reports.length - 5) {
    await loadReportsUntil(index + 10)
  }
}

const onDeal = (index: number) => {
  if (range.value === 0) reports.splice(index, 1)
}

watch(range, async () => {
  reports.splice(0, reports.length)
  await loadReportsUntil(10)
})

onMounted(async () => {
  await loadReportsUntil(10)
})
</script>

<style lang="scss" scoped></style>
