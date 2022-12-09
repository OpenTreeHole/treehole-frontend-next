<template>
  <div>
    <FloorBlockHeader :floor="floor" />

    <FloorBlockContent :floor="floor" />

    <FloorBlockAction :floor="floor" />
  </div>
</template>

<script setup lang="ts">
import { Floor } from '@/types'

import FloorBlockAction from '@/components/floor/FloorBlockAction.vue'
import FloorBlockHeader from '@/components/floor/FloorBlockHeader.vue'
import FloorBlockContent from '@/components/floor/FloorBlockContent.vue'

defineProps<{ floor: Floor }>()
</script>
