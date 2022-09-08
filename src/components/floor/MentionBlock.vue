<template>
  <blockquote>
    <FloorBlockHeader
      class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_less'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
      :floor="mention"
      display-floor-id
    />

    <div
      class="line-clamp-5 mt-2"
      v-html="parseToTypora(mention.content)"
    />
  </blockquote>
</template>

<script
  lang="ts"
  setup
>
import { parseToTypora } from '@/utils'
import { Floor } from '@/types'
import FloorBlockHeader from '@/components/floor/FloorBlockHeader.vue'

defineProps<{ mention: Floor }>()
</script>
