<template>
  <div
    v-if="folded"
    class="py-2"
  >
    <div
      class="text-gray-600 hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_more'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
      @click="folded = false"
    >
      {{ floor.fold }}
    </div>
  </div>
  <template v-else>
    <div
      v-if="replyFloor"
      class="flex my-2"
    >
      <div
        class="flex hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_less'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
        @click="gotoReply"
      >
        <p class="line-clamp-2 justify-center">
          回复
          <span :class="computeColorClass(replyFloor.anonyname)"> ##{{ replyFloor.id }} </span>
          ：
          <span class="text-neutral-500">{{ replyFloor.content }}</span>
        </p>
      </div>
    </div>
    <div
      class="markdown-viewer mt-2"
      :class="floor.deleted ? 'markdown-gray' : ''"
    >
      <template
        v-for="(_, i) in blocksPlaceholderArray"
        :key="i"
      >
        <div
          v-if="i % 2 === 0"
          v-html="markdownBlocks[i / 2]"
        />
        <MentionBlock
          v-else
          :mention="mentionBlocks[(i - 1) / 2]!"
        />
      </template>
    </div>
    <div class="flex justify-end">
      <span class="text-neutral-400 text-sm px-2">##{{ floor.id }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { generateColor, parseToTypora } from '@/utils'

import { DetailedFloor, Floor } from '@/types'
import MentionBlock from '@/components/floor/MentionBlock.vue'
import { computed, inject, ref } from 'vue'

const props = defineProps<{ floor: Floor; banFold?: boolean }>()

const replyRegexResult = computed(() => /^\s*##(\d+)\b\s*/g.exec(props.floor.content))
const replyFloor = computed(
  () =>
    (replyRegexResult.value &&
      props.floor instanceof DetailedFloor &&
      props.floor.mention.find((floor) => floor.id.toString() === replyRegexResult.value![1])) ||
    null
)

const markdownBlocks = computed(() => {
  const html = props.floor.content
    .replaceAll(/^##(\d+)\b\s*/g, '')
    .split(/##\d+\b/g)
    .map((v) => v.trim())
  if (html[html.length - 1] === '') {
    html.pop()
  }
  return html.map(parseToTypora)
})

const mentionBlocks = computed(() =>
  [...props.floor.content.replaceAll(/^##(\d+)\b\s*/g, '').matchAll(/##(\d+)\b\s*/g)].map(
    (v) =>
      (props.floor instanceof DetailedFloor &&
        props.floor.mention.find((floor) => floor.id.toString() === v[1])) ||
      null
  )
)

const numOfBlocks = computed(() => mentionBlocks.value.length + markdownBlocks.value.length)
const blocksPlaceholderArray = computed(() => Array.from({ length: numOfBlocks.value }))

const folded = ref(props.floor.fold.length !== 0 && !props.banFold)

const computeColorClass = (str: string) => 'text-' + generateColor(str)

const scrollToFloor = inject<(id: number) => void>('scrollToFloor')!

const gotoReply = () => {
  if (replyFloor.value) {
    scrollToFloor(replyFloor.value.id)
  }
}
</script>

<style lang="scss" scoped>
.markdown-gray {
  --text-color: rgb(75 85 99);
}
</style>
