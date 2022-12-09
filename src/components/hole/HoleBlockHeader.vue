<template>
  <div class="w-full flex flex-wrap items-center gap-y-2">
    <TagChip
      v-for="(tag, tagIndex) in hole.tags"
      :key="tagIndex"
      class="mr-2"
      size="small"
      :tag="tag"
    ></TagChip>
    <div class="grow flex justify-end space-x-3">
      <SpecialFlagChip
        v-if="hole.firstFloor.specialTag"
        :text="hole.firstFloor.specialTag"
        color="red"
        size="small"
      ></SpecialFlagChip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hole } from '@/types'
import SpecialFlagChip from '@/components/tag/SpecialFlagChip.vue'
import TagChip from '@/components/tag/TagChip.vue'

defineProps<{ hole: Hole }>()
</script>
