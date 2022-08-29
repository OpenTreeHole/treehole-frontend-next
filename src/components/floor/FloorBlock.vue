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
      <span class="grow"></span>
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
      <div class="w-full px-2 flex justify-end">
        <span class="text-neutral-400 text-sm px-2">##{{ floor.id }}</span>
      </div>
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
        <IconBtn @click="reply">md:chat</IconBtn>
        <v-divider
          class="mx-1"
          vertical
        />
        <IconBtn @click="edit">md:edit</IconBtn>
        <IconBtn @click="toggleAction(ActionType.Delete)">md:delete</IconBtn>
        <IconBtn @click="toggleAction(ActionType.Penalty)">md:person_off</IconBtn>
        <IconBtn @click="toggleAction(ActionType.History)">md:history</IconBtn>
        <v-divider
          class="mx-1"
          vertical
        />
        <IconBtn @click="toggleAction(ActionType.Report)">md:report</IconBtn>
      </div>
      <v-divider
        v-if="action !== ActionType.None"
        class="mx-2 my-2"
      />
      <template v-if="action === ActionType.Reply || action === ActionType.Edit">
        <div class="flex justify-center">
          <div class="ml-5 mr-2 max-w-[var(--editor-max-width)] flex grow">
            <span class="self-center font-semibold text-orange-400">
              特殊标签（留空则无特殊标签）：
            </span>
            <v-text-field
              class="grow mr-2"
              hide-details
              variant="outlined"
              autofocus
              density="compact"
            />
          </div>
        </div>
        <div class="flex justify-center">
          <p
            v-if="action === ActionType.Reply"
            class="line-clamp-1 ml-5 mr-2 max-w-[var(--editor-max-width)] grow mt-2"
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
        <QuestionAction
          text="请输入举报理由："
          text-class="text-blue-600"
          @cancel="action = ActionType.None"
        >
          <v-text-field
            class="grow mr-2"
            hide-details
            variant="outlined"
            autofocus
            density="compact"
          />
        </QuestionAction>
      </template>
      <template v-else-if="action === ActionType.Delete">
        <QuestionAction
          class="mt-4"
          text="确认删除？"
          text-class="text-red"
          @cancel="action = ActionType.None"
        />
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
      <template v-else-if="action === ActionType.Penalty">
        <QuestionAction
          text="请输入封禁等级："
          text-class="text-blue-600"
          @cancel="action = ActionType.None"
        >
          <v-select
            class="grow mr-2"
            :items="[1, 2, 3]"
            hide-details
            variant="outlined"
            autofocus
            density="compact"
          />
        </QuestionAction>
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
import IconBtn from '@/components/button/IconBtn.vue'
import { useEditor } from '@/composables/editor'
import Editor from '@/components/editor/Editor.vue'
import { computed, ref } from 'vue'
import { arrayFactory } from '@/utils/reflect'
import HistoryBlock from '@/components/floor/HistoryBlock.vue'
import QuestionAction from '@/components/action/QuestionAction.vue'

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
  History,
  Penalty,
  Tag,
  Division
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
