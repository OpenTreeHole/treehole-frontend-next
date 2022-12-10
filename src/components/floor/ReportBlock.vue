<template>
  <div>
    <p class="flex">
      <span class="font-bold min-w-max">举报理由：</span>
      <span> {{ report.reason }} </span>
      <span class="grow"></span>
      <IconBtn @click="showContent = !showContent">
        {{ showContent ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
      </IconBtn>
    </p>
    <p class="flex text-sm text-neutral-400">
      <span class="min-w-max text-gray-500">举报于</span>
      <span class="ml-1">{{ timeDifference(report.timeCreated) }}</span>
    </p>
    <div
      v-if="showContent"
      class="mt-2 pl-4 border-l-2"
    >
      <FloorBlockHeader :floor="report.floor" />

      <FloorBlockContent
        :floor="report.floor"
        ban-fold
      />
    </div>
    <ReportBlockAction
      v-model:report="report"
      @deal="emit('deal')"
    />
  </div>
</template>

<script setup lang="ts">
import { timeDifference } from '@/utils'
import { Report } from '@/types'
import FloorBlockContent from '@/components/floor/FloorBlockContent.vue'
import FloorBlockHeader from '@/components/floor/FloorBlockHeader.vue'
import ReportBlockAction from '@/components/floor/ReportBlockAction.vue'
import IconBtn from '../button/IconBtn.vue'
import { computed, ref } from 'vue'

const props = defineProps<{ report: Report }>()
const emit = defineEmits<{
  (e: 'update:report', report: Report): void
  (e: 'deal'): void
}>()

const report = computed({
  get: () => props.report,
  set: (report: Report) => emit('update:report', report)
})

const showContent = ref(true)
</script>

<style lang="scss" scoped></style>
