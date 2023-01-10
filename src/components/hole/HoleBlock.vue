<template>
  <div class="px-6 lg:px-10 py-5">
    <HoleBlockHeader :hole="hole" />
    <HoleBlockFirst :hole="hole" />
    <HoleBlockFooter :hole="hole" />
  </div>
</template>

<script setup lang="ts">
import { Hole } from '@/types'
import HoleBlockFirst from './HoleBlockFirst.vue'
import HoleBlockHeader from './HoleBlockHeader.vue'
import HoleBlockFooter from './HoleBlockFooter.vue'
defineProps<{ hole: Hole }>()
</script>
