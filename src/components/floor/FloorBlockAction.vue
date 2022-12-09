<template>
  <div>
    <div class="flex justify-end mt-2 overflow-visible">
      <IconBtn
        icon-class="text-red"
        :text="floor.like"
      >
        mdi-thumb-up-outline
      </IconBtn>
      <IconBtn @click="reply">mdi-chat-outline</IconBtn>
      <v-divider
        class="mx-1"
        :vertical="true"
      />
      <IconBtn @click="edit">mdi-pencil-outline</IconBtn>
      <IconBtn @click="toggleAction(ActionType.Delete)">mdi-delete-outline</IconBtn>
      <IconBtn @click="toggleAction(ActionType.Penalty)">mdi-account-off-outline</IconBtn>
      <IconBtn @click="toggleAction(ActionType.History)">mdi-history</IconBtn>
      <v-divider
        class="mx-1"
        :vertical="true"
      />
      <IconBtn @click="toggleAction(ActionType.Report)">mdi-alert-octagon-outline</IconBtn>
    </div>
    <v-divider
      v-if="action !== ActionType.None"
      class="my-2"
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
            :autofocus="true"
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
          :autofocus="true"
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
  </div>
</template>

<script setup lang="ts">
import IconBtn from '@/components/button/IconBtn.vue'
import Editor from '@/components/editor/Editor.vue'
import HistoryBlock from '@/components/floor/HistoryBlock.vue'
import QuestionAction from '@/components/action/QuestionAction.vue'
import { camelizeKeys, generateColor } from '@/utils'
import { useEditor } from '@/composables/editor'
import { ref } from 'vue'
import { Floor, FloorHistory } from '@/types'
import { arrayFactory } from '@/utils/reflect'

const props = defineProps<{ floor: Floor }>()

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

const { editorData, initEditor } = useEditor()
const action = ref<ActionType>(ActionType.None)
const computeColorClass = (str: string) => 'text-' + generateColor(str)

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
</script>

<style lang="scss" scoped></style>
