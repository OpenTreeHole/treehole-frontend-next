<template>
  <div>
    <FloorBlockHeader :floor="floor" />

    <FloorBlockContent :floor="floor" />

    <FloorBlockAction
      v-model:floor="floor"
      @new-content="$emit('newContent')"
    />
  </div>
</template>

<script setup lang="ts">
import { Floor } from '@/types'

import FloorBlockAction from '@/components/floor/FloorBlockAction.vue'
import FloorBlockHeader from '@/components/floor/FloorBlockHeader.vue'
import FloorBlockContent from '@/components/floor/FloorBlockContent.vue'
import { computed } from 'vue'

const props = defineProps<{ floor: Floor }>()
const emit = defineEmits<{
  (e: 'update:floor', floor: Floor): void
  (e: 'newContent'): void
}>()

const floor = computed({
  get: () => props.floor,
  set: (floor: Floor) => emit('update:floor', floor)
})
</script>
