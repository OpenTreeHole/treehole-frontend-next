<template>
  <div class="flex-col">
    <div class="w-full flex justify-start">
      <span
        class="border-r-2 pr-2 self-center"
        :class="computeColorClass(floor.anonyname)"
      >
        {{ floor.anonyname }}
      </span>
      <span class="pl-2 text-neutral-400 text-sm self-center">
        {{ timeDifference(floor.timeUpdated) }}
      </span>
      <span class="flex-grow-1"></span>
      <SpecialFlagChip
        v-if="floor.specialTag"
        class="mr-4"
        :text="floor.specialTag"
        color="red"
      />
    </div>
    <div
      class="w-full markdown-viewer mt-2"
      v-html="parseToTypora(floor.content)"
    />
    <div class="w-full flex justify-end mt-2 px-2 overflow-visible">
      <span class="px-2">
        <span
          class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
        >
          <v-icon
            icon="md:thumb_up"
            color="red"
          />
          <span class="pl-1 self-center">1</span>
        </span>
      </span>
      <span class="px-2">
        <span
          class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
        >
          <v-icon icon="md:chat" />
        </span>
      </span>
      <v-divider
        class="mx-1"
        vertical
      />
      <span class="px-2">
        <span
          class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
          @click="$emit('edit')"
        >
          <v-icon icon="md:edit" />
        </span>
      </span>
      <v-divider
        class="mx-1"
        vertical
      />
      <span class="px-2">
        <span
          class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
        >
          <v-icon
            class="-mt-1"
            icon="md:report"
          />
        </span>
      </span>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { Floor } from '@/types'
import { generateColor, timeDifference } from '@/utils'
import TyporaParser from 'typora-parser'
import { KatexRenderer } from '@/utils/katex'
import HighlightJsRenderer from 'typora-parser/build/src/plugins/HighlightJsRenderer'
import SpecialFlagChip from '@/components/tag/SpecialFlagChip.vue'

defineProps<{ floor: Floor }>()
defineEmits<{
  (e: 'edit'): void
}>()

const computeColorClass = (str: string) => 'text-' + generateColor(str)
const parseToTypora = (markdown: string) => {
  markdown = markdown.trim().replace('\n\n', '\n').replace('\n', '\n\n')
  const parseResult = TyporaParser.parse(markdown)
  return parseResult.renderHTML({
    latexRenderer: new KatexRenderer(),
    codeRenderer: new HighlightJsRenderer({
      displayLineNumbers: true // display line numbers on code block, no effect when vanillaHTML: true
    })
  })
}
</script>

<style
  lang="scss"
  scoped
></style>
