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
        {{ floor.fold }}
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
        <span class="px-2">
          <span
            class="hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none transition"
            @click="showHistory"
          >
            <v-icon icon="md:history" />
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
      <v-divider
        v-if="action !== ActionType.None"
        class="mx-2 my-2"
      />
      <template v-if="action === ActionType.Reply || action === ActionType.Edit">
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
      <template v-else-if="action === ActionType.History">
        <div class="mt-4 ml-2 pl-2 border-l-2">
          <template
            v-for="(history, index) in histories"
            :key="index"
          >
            <HistoryBlock :history="history" />
            <v-divider
              v-if="index !== histories.length - 1"
              class="mt-2 mb-4 mx-2"
            />
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { Floor, FloorHistory } from '@/types'
import { camelizeKeys, generateColor, timeDifference, parseToTypora } from '@/utils'
import SpecialFlagChip from '@/components/tag/SpecialFlagChip.vue'
import { useEditor } from '@/composables/editor'
import Editor from '@/components/editor/Editor.vue'
import { computed, ref } from 'vue'
import { arrayFactory } from '@/utils/reflect'
import HistoryBlock from '@/components/floor/HistoryBlock.vue'

const props = defineProps<{ floor: Floor }>()

const histories = arrayFactory(
  FloorHistory,
  camelizeKeys([
    {
      content:
        '现代社会以海德格尔的一句“一切实践传统都已经瓦解完了”为嚆矢。滥觞于家庭与社会传统的期望正失去它们的借鉴意义。但面对看似无垠的未来天空，我想循卡尔维诺“树上的男爵”的生活好过过早地振翮。' +
        '\n' +
        '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。',
      floor_id: 12321,
      id: 0,
      reason: '',
      user_id: 123,
      time_created: '2022-07-27T17:07:39.802Z',
      time_updated: '2022-07-27T17:07:39.802Z'
    },
    {
      content:
        '现代社会以海德格尔的一句“一切实践传统都已经瓦解完了”为嚆矢。滥觞于家庭与社会传统的期望正失去它们的借鉴意义。但面对看似无垠的未来天空，我想循卡尔维诺“树上的男爵”的生活好过过早地振翮。' +
        '\n' +
        '我们怀揣热忱的灵魂天然被赋予对超越性的追求，不屑于古旧坐标的约束，钟情于在别处的芬芳。但当这种期望流于对过去观念不假思索的批判，乃至走向虚无与达达主义时，便值得警惕了。',
      floor_id: 12321,
      id: 0,
      reason: '',
      user_id: 123,
      time_created: '2022-07-27T17:07:39.802Z',
      time_updated: '2022-07-27T17:07:39.802Z'
    }
  ])
)

enum ActionType {
  None,
  Edit,
  Reply,
  Report,
  Delete,
  History
}

const computeColorClass = (str: string) => 'text-' + generateColor(str)

const { editorData, initEditor } = useEditor()
const action = ref<ActionType>(ActionType.None)

const toggleAction = (type: ActionType) => {
  action.value = action.value === type ? ActionType.None : type
}

const edit = () => {
  initEditor(props.floor.content)
  toggleAction(ActionType.Edit)
}

const reply = () => {
  initEditor('')
  toggleAction(ActionType.Reply)
}

const report = () => {
  toggleAction(ActionType.Report)
}

const remove = () => {
  toggleAction(ActionType.Delete)
}

const showHistory = () => {
  toggleAction(ActionType.History)
}

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
