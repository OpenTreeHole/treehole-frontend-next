<template>
  <div class="flex-col">
    <div class="w-full flex justify-start">
      <span
        class="border-r-2 pr-2 self-center"
        :class="computeColorClass(floor.anonyname)"
      >
        {{ floor.anonyname }}
      </span>
      <span class="px-2 text-neutral-400 text-sm self-center flex-shrink-1 line-clamp-1">
        {{ timeDifference(floor.timeUpdated) }}
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
        class="mr-4"
        :text="floor.specialTag"
        color="red"
      />
    </div>
    <div
      v-if="folded"
      class="w-full py-2"
    >
      <div
        class="text-gray-600 hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_more'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
        @click="folded = false"
      >
        {{ floor.fold }}
      </div>
    </div>
    <template v-else>
      <div
        class="w-full markdown-viewer mt-2"
        :class="floor.deleted ? 'markdown-gray' : ''"
        v-html="parseToTypora(floor.content)"
      />
      <div class="w-full px-2 flex justify-end">
        <span class="text-neutral-400 text-sm px-2">##{{ floor.id }}</span>
      </div>
    </template>
    <FloorBlockAction :floor="floor" />
  </div>
</template>

<script
  setup
  lang="ts"
>
import { Floor } from '@/types'
import { timeDifference, parseToTypora, generateColor } from '@/utils'
import SpecialFlagChip from '@/components/tag/SpecialFlagChip.vue'
import { computed, ref } from 'vue'
import FloorBlockAction from '@/components/floor/FloorBlockAction.vue'

const computeColorClass = (str: string) => 'text-' + generateColor(str)
const props = defineProps<{ floor: Floor }>()

const folded = ref(props.floor.fold !== '')

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
>
.markdown-gray {
  --text-color: rgb(75 85 99);
}
</style>
