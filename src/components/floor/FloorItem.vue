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
        class="ml-3"
        :text="floor.specialTag"
        color="red"
      />
    </div>
    <div
      class="w-full markdown-viewer mt-2"
      v-html="parseToTypora(floor.content)"
    />
    <div class="w-full flex justify-end mt-2">
      <span class="px-2">
        <v-icon
          icon="md:thumb_up"
          color="red"
        />
        <span class="pl-1 self-center">1</span>
      </span>
      <span class="px-2">
        <v-icon icon="md:chat" />
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
