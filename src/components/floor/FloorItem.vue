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
      <span class="flex-grow-1"></span>
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
        {{ floor.fold[0] }}
      </div>
    </div>
    <template v-else>
      <div
        class="w-full markdown-viewer mt-2"
        :class="floor.deleted ? 'markdown-gray' : ''"
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
            @click="reply"
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
            @click="edit"
          >
            <v-icon icon="md:edit" />
          </span>
        </span>
        <span class="px-2">
          <span
            class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
            @click="remove"
          >
            <v-icon icon="md:delete" />
          </span>
        </span>
        <v-divider
          class="mx-1"
          vertical
        />
        <span class="px-2">
          <span
            class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
            @click="report"
          >
            <v-icon
              class="-mt-1"
              icon="md:report"
            />
          </span>
        </span>
      </div>
      <template v-if="action === ActionType.Reply || action === ActionType.Edit">
        <v-divider class="mx-2 my-2" />
        <div class="flex justify-center">
          <p
            v-if="action === ActionType.Reply"
            class="line-clamp-1 ml-5 mr-2 max-w-[650px] flex-grow-1 mt-2"
          >
            回复
            <span :class="computeColorClass(floor.anonyname)"> {{ floor.anonyname }} </span>：
            <span class="text-neutral-500">{{ floor.content }}</span>
          </p>
        </div>
        <Editor
          :key="editorData"
          class="mr-2"
          :data="editorData"
          @close="action = ActionType.None"
        ></Editor>
      </template>
      <template v-else-if="action === ActionType.Report">
        <v-divider class="mx-2 my-2" />
        <div class="flex">
          <span class="self-center font-semibold text-blue-600">请输入举报理由：</span>
          <v-text-field
            class="flex-grow-1 mr-2"
            hide-details
            variant="outlined"
            autofocus
            density="compact"
          />
          <span class="px-1 self-center">
            <span
              class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1 p-1 transition cursor-pointer rounded-lg select-none transition text-green"
            >
              <v-icon icon="md:done" />
            </span>
          </span>
          <span class="px-1 self-center">
            <span
              class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1 p-1 transition cursor-pointer rounded-lg select-none transition text-red"
              @click="action = ActionType.None"
            >
              <v-icon icon="md:close" />
            </span>
          </span>
        </div>
      </template>
      <template v-else-if="action === ActionType.Delete">
        <v-divider class="mx-2 my-2" />
        <div class="flex mt-4">
          <span class="self-center font-semibold text-red flex-grow-1">确认删除？</span>
          <span class="px-1 self-center">
            <span
              class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1 p-1 transition cursor-pointer rounded-lg select-none transition text-green"
            >
              <v-icon icon="md:done" />
            </span>
          </span>
          <span class="px-1 self-center">
            <span
              class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1 p-1 transition cursor-pointer rounded-lg select-none transition text-red"
              @click="action = ActionType.None"
            >
              <v-icon icon="md:close" />
            </span>
          </span>
        </div>
      </template>
    </template>
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
import { useEditor } from '@/composables/editor'
import Editor from '@/components/editor/Editor.vue'
import { computed, ref } from 'vue'

const props = defineProps<{ floor: Floor }>()
defineEmits<{
  (e: 'edit'): void
}>()

enum ActionType {
  None,
  Edit,
  Reply,
  Report,
  Delete
}

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

const { editorData, initEditor } = useEditor()
const action = ref<ActionType>(ActionType.None)

const edit = () => {
  initEditor(props.floor.content)
  action.value = ActionType.Edit
}

const reply = () => {
  initEditor('')
  action.value = ActionType.Reply
}

const report = () => {
  action.value = ActionType.Report
}

const remove = () => {
  action.value = ActionType.Delete
}

const folded = ref(props.floor.fold.length > 0)

const extraInfo = computed(() => {
  const ret: string[] = []
  if (props.floor.deleted) ret.push('已删除')
  if (props.floor.fold.length > 0) ret.push('已折叠')
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
