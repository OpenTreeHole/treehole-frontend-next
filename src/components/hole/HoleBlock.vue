<template>
  <router-link to="/hole/1">
  <div>
    <HoleBlockFirst :hole="hole" />
    <HoleBlockReply :floor="hole.lastFloor" />
  </div>
</router-link>
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
