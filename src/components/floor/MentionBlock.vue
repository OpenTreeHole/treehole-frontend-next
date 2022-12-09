<template>
  <blockquote>
    <FloorBlockHeader
      class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 cursor-pointer rounded-lg select-none transition relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_less'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
      :floor="mention"
      display-floor-id
      @click="gotoMention"
    />

    <div
      class="line-clamp-5 mt-2"
      v-html="parseToTypora(mention.content)"
    />
  </blockquote>
</template>

<script lang="ts" setup>
import { parseToTypora } from '@/utils'
import { Floor } from '@/types'
import FloorBlockHeader from '@/components/floor/FloorBlockHeader.vue'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ mention: Floor }>()

const scrollToMention = inject<(id: number) => void>('scrollToFloor')!
const holeId = inject<number>('holeId')!

const router = useRouter()

const gotoMention = () => {
  if (props.mention.holeId === holeId) {
    scrollToMention(props.mention.id)
  } else {
    router.push({ name: 'hole', query: { floor: props.mention.id.toString() } })
  }
}
</script>
