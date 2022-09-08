<template>
  <div class="flex justify-start">
    <span
      class="border-r-2 pr-2 self-center"
      :class="computeColorClass(floor.anonyname)"
    >
      {{ floor.anonyname }}
    </span>
    <span class="px-2 text-neutral-400 text-sm self-center flex-shrink-1 line-clamp-1">
      {{ displayFloorId ? `##${floor.id}` : timeDifference(floor.timeUpdated) }}
    </span>
    <span
      v-if="extraInfo"
      class="border-l-2 pl-2 text-neutral-400 text-sm self-center flex-shrink-1 line-clamp-1"
    >
      {{ extraInfo }}
    </span>
    <span class="grow"></span>
    <SpecialFlagChip
      v-if="floor.specialTag"
      class="mr-2"
      :text="floor.specialTag"
      color="red"
    />
  </div>
</template>

<script
  setup
  lang="ts"
>
import SpecialFlagChip from '@/components/tag/SpecialFlagChip.vue'
import { timeDifference, generateColor } from '@/utils'
import { computed } from 'vue'
import { Floor } from '@/types'

const props = defineProps<{ floor: Floor; displayFloorId?: boolean }>()

const computeColorClass = (str: string) => 'text-' + generateColor(str)

const extraInfo = computed(() => {
  const ret: string[] = []
  if (props.floor.deleted) ret.push('已删除')
  if (props.floor.fold) ret.push('已折叠')
  return ret.join('，')
})
</script>

<style
  lang="scss"
  scoped
></style>
