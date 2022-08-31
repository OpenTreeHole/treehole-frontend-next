<template>
  <div>
    <p class="flex">
      <span class="font-bold min-w-max">举报理由：</span>
      <span> {{ report.reason }} </span>
    </p>
    <p class="flex text-sm text-neutral-400">
      <span class="min-w-max text-gray-500">举报于</span>
      <span class="ml-1">{{ timeDifference(report.timeCreated) }}</span>
    </p>
    <div class="mt-2 pl-4 border-l-2">
      <FloorBlockHeader :floor="report.floor" />

      <FloorBlockContent
        :floor="report.floor"
        ban-fold
      />
    </div>
    <ReportBlockAction />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { timeDifference } from '@/utils'
import { Report } from '@/types'
import FloorBlockContent from '@/components/floor/FloorBlockContent.vue'
import FloorBlockHeader from '@/components/floor/FloorBlockHeader.vue'
import ReportBlockAction from '@/components/floor/ReportBlockAction.vue'

defineProps<{ report: Report }>()
</script>

<style
  lang="scss"
  scoped
></style>
