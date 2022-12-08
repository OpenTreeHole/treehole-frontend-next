<template>
  <div class="w-full border-t mt-2 py-2 text-sm">
    <div>
      {{ floor.content }}
    </div>
    <div class="text-right text-sm text-neutral-400">Linus Torvalds 回复于 2022/8/12</div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { Floor } from '@/types'

defineProps<{ floor: Floor }>()
</script>
