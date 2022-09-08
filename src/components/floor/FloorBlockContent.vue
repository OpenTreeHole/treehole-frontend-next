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
      v-if="replyFloor"
      class="flex my-2"
    >
      <div
        class="flex hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_less'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
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
      ref="floorContent"
      class="markdown-viewer mt-2"
      :class="floor.deleted ? 'markdown-gray' : ''"
      v-html="parseToTypora(content)"
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
import { generateColor, parseToTypora } from '@/utils'

import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { DetailedFloor, Floor } from '@/types'
import { renderComponent } from '@/utils/vnode'
import MentionBlock from '@/components/floor/MentionBlock.vue'

const props = defineProps<{ floor: Floor; banFold?: boolean }>()

const replyRegexResult = /^\s*##(\d+)\s*/g.exec(props.floor.content)
const replyFloor =
  (replyRegexResult &&
    props.floor instanceof DetailedFloor &&
    props.floor.mention.find((floor) => floor.id.toString() === replyRegexResult[1])) ||
  null

const content = props.floor.content
  .replaceAll(/^##(\d+)\s*/g, '')
  .replaceAll(/##(\d+)\s*/g, (_, mentionFloorId) => `<div mention="${mentionFloorId}"></div>`)

const { appContext } = getCurrentInstance()!

const folded = ref(props.floor.fold !== '' && !props.banFold)
const floorContent = ref<HTMLElement | null>(null)

const mentionDestroyer: (() => void)[] = []

onMounted(() => {
  if (floorContent.value && props.floor instanceof DetailedFloor) {
    const mentionElements = floorContent.value.querySelectorAll('div[mention]')
    for (const element of mentionElements) {
      const mentionFloorId = element.getAttribute('mention')!
      const mentionFloor = props.floor.mention.find(
        (floor) => floor.id.toString() === mentionFloorId
      )
      if (mentionFloor)
        mentionDestroyer.push(
          renderComponent(element, MentionBlock, { mention: mentionFloor }, appContext)
        )
    }
  }
})

onUnmounted(() => {
  mentionDestroyer.forEach((v) => v())
})

const computeColorClass = (str: string) => 'text-' + generateColor(str)
</script>

<style
  lang="scss"
  scoped
>
.markdown-gray {
  --text-color: rgb(75 85 99);
}
</style>
