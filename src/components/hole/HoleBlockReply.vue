<template>
  <div class="w-full border-t mt-2 pt-2 text-sm">
    <div class="line-clamp-2">
      {{ plainText(floor.content) }}
    </div>
    <div class="text-right text-sm text-neutral-400">
      <span :class="'text-' + generateColor(floor.anonyname)">{{ floor.anonyname }}</span> 回复于
      {{ timeDifference(floor.timeCreated) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Floor } from '@/types'
import { plainText, timeDifference } from '@/utils'
import { generateColor } from '@/utils'

defineProps<{ floor: Floor }>()
</script>
