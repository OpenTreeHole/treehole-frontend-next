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
          v-else-if="mentionBlocks[(i - 1) / 2]"
          :mention="mentionBlocks[(i - 1) / 2]!"
        />
      </template>
    </div>
    <div class="flex justify-end">
      <span class="text-neutral-500 text-sm px-2">
        <template v-if="props.storey">
          {{ props.storey }}F(<span
            class="text-neutral-400 hover:text-neutral-300 transition cursor-pointer active:text-neutral-300 focus:ring-0"
            @click="scrollToFloor(floor)"
            >##{{ floor.id }}</span
          >)
        </template>
        <template v-else>
          <span
            class="text-neutral-400 hover:text-neutral-300 transition cursor-pointer active:text-neutral-300 focus:ring-0"
            @click="scrollToFloor(floor)"
            >##{{ floor.id }}</span
          >
        </template>
      </span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { generateColor, parseToTypora } from '@/utils'

import { DetailedFloor, Floor } from '@/types'
import MentionBlock from '@/components/floor/MentionBlock.vue'
import { computed, inject, reactive, ref, watch } from 'vue'
import { getFloor, getHole } from '@/apis'

const props = defineProps<{ floor: Floor; storey?: number; banFold?: boolean }>()

const replyRegexResult = computed(() => /^\s*#{1,2}(\d+)\b\s*/g.exec(props.floor.content))
const replyFloor = computed(
  () =>
    (replyRegexResult.value &&
      props.floor instanceof DetailedFloor &&
      props.floor.mention.find((floor) => floor.id.toString() === replyRegexResult.value![1])) ||
    null
)

const markdownBlocks = computed(() => {
  const html = props.floor.content
    .replaceAll(/^#{1,2}(\d+)\b\s*/g, '')
    .split(/#{1,2}\d+\b/g)
    .map((v) => v.trim())
  if (html[html.length - 1] === '') {
    html.pop()
  }
  return html.map(parseToTypora)
})

const mentions = reactive<Record<string, Floor>>(
  props.floor instanceof DetailedFloor
    ? props.floor.mention.reduce((acc, cur) => ({ ...acc, [`##${cur.id}`]: cur }), {})
    : {}
)

const mentionBlocks = computed(() =>
  [...props.floor.content.replaceAll(/^#{1,2}(\d+)\b\s*/g, '').matchAll(/#{1,2}(\d+)\b\s*/g)].map(
    (v) => mentions[v[0]] || null
  )
)

const numOfBlocks = computed(() => mentionBlocks.value.length + markdownBlocks.value.length)
const blocksPlaceholderArray = computed(() => Array.from({ length: numOfBlocks.value }))

const folded = ref(props.floor.fold.length !== 0 && !props.banFold)

const computeColorClass = (str: string) => 'text-' + generateColor(str)

const scrollToFloor = inject<(floor: Floor | number) => void>('scrollToFloor')!

const gotoReply = () => {
  if (replyFloor.value) {
    scrollToFloor(replyFloor.value)
  }
}

watch(
  () => props.floor,
  async () => {
    const mentionStrs = props.floor.content
      .replaceAll(/^#{1,2}(\d+)\b\s*/g, '')
      .matchAll(/#{1,2}(\d+)\b\s*/g)
    for (const mentionStr of mentionStrs) {
      const mention = mentions[mentionStr[0]]
      if (!mention) {
        if (mentionStr[0].startsWith('##')) {
          mentions[mentionStr[0]] = await getFloor(parseInt(mentionStr[1]))
        } else {
          mentions[mentionStr[0]] = (await getHole(parseInt(mentionStr[1]))).firstFloor
        }
      }
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.markdown-gray {
  --text-color: rgb(75 85 99);
}
</style>
