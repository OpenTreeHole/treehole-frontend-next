<template>
  <div>
    <HoleBlockFirst :hole="hole" />
    <HoleBlockReply :floor="hole.lastFloor" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { Hole } from '@/types'
import HoleBlockFirst from './HoleBlockFirst.vue'
import HoleBlockReply from './HoleBlockReply.vue'
defineProps<{ hole: Hole }>()
</script>
