<template>
  <div class="w-full flex flex-wrap items-center gap-y-2">
    <TagChip
      v-for="(tag, tagIndex) in hole.tags"
      :key="tagIndex"
      class="mr-2"
      size="small"
      :tag="tag"
      @click="tagStore.filterTag = tag"
    ></TagChip>
    <div class="grow flex justify-end space-x-3">
      <SpecialFlagChip
        v-if="hole.firstFloor.specialTag"
        :text="hole.firstFloor.specialTag"
        color="red"
        size="small"
      ></SpecialFlagChip>

      <SpecialFlagChip
        v-if="isPinned"
        text="置顶"
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
import { useDivisionStore, useTagStore } from '@/store'
import { computed } from 'vue'

const props = defineProps<{ hole: Hole }>()

const divisionStore = useDivisionStore()
const tagStore = useTagStore()

const pinnedHoles = computed(() =>
  divisionStore.currentDivisionId
    ? divisionStore.getDivisionById(divisionStore.currentDivisionId)!.pinned
    : []
)

const isPinned = computed(() => !pinnedHoles.value.every((hole) => hole.id !== props.hole.id))
</script>
