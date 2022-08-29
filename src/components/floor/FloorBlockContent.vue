<template>
  <div
    v-if="folded"
    class="py-2"
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
      class="markdown-viewer mt-2"
      :class="floor.deleted ? 'markdown-gray' : ''"
      v-html="parseToTypora(floor.content)"
    />
    <div class="flex justify-end">
      <span class="text-neutral-400 text-sm px-2">##{{ floor.id }}</span>
    </div>
  </template>
</template>

<script
  setup
  lang="ts"
>
import { parseToTypora } from '@/utils'

import { ref } from 'vue'
import { Floor } from '@/types'

const props = defineProps<{ floor: Floor }>()

const folded = ref(props.floor.fold !== '')
</script>

<style
  lang="scss"
  scoped
>
.markdown-gray {
  --text-color: rgb(75 85 99);
}
</style>
