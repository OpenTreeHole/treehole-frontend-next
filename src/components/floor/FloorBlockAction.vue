<template>
  <div>
    <div class="flex justify-end mt-2 overflow-visible">
      <IconBtn
        :icon-class="
          floor instanceof DetailedFloor && floor.liked ? 'text-red-500' : 'text-neutral-400'
        "
        :text="floor.like"
        @click="sendLike"
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
        <div class="lg:ml-5 mr-2 max-w-[var(--editor-max-width)] flex grow">
          <span class="self-center font-semibold text-orange-400">
            特殊标签（留空则无特殊标签）：
          </span>
          <v-text-field
            v-model="specialTag"
            class="grow lg:mr-4"
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
        @send="
          (content) => {
            if (action === ActionType.Reply) {
              sendReply(content)
            } else if (action === ActionType.Edit) {
              sendEdit(content)
            }
            action = ActionType.None
          }
        "
      ></Editor>
    </template>
    <template v-else-if="action === ActionType.Report">
      <QuestionAction
        text="请输入举报理由："
        text-class="text-blue-600"
        @done="sendReport"
        @cancel="action = ActionType.None"
      >
        <v-text-field
          v-model="reportReason"
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
        :text="floor instanceof DetailedFloor && floor.isMe ? '确认删除？' : '请输入删除理由：'"
        text-class="text-red"
        @done="sendDelete"
        @cancel="action = ActionType.None"
      >
        <v-text-field
          v-if="!(floor instanceof DetailedFloor && floor.isMe)"
          v-model="deleteReason"
          class="grow mr-2"
          hide-details
          variant="outlined"
          :autofocus="true"
          density="compact"
        />
      </QuestionAction>
    </template>
    <template v-else-if="action === ActionType.History">
      <div
        v-if="histories.length > 0"
        class="mt-4 ml-2 pl-2 border-l-2"
      >
        <template
          v-for="(history, index) in histories"
          :key="index"
        >
          <HistoryBlock
            :history="history"
            @restore="(reason) => sendRestoreHistory(history, reason)"
          />
          <v-divider
            v-if="index !== histories.length - 1"
            class="mt-2 mb-4 mx-2"
          />
        </template>
      </div>
      <div
        v-else
        class="mt-4 pl-2"
      >
        <p class="text-neutral-400">暂无历史记录</p>
      </div>
    </template>
    <template v-else-if="action === ActionType.Penalty">
      <QuestionAction
        text="请输入封禁等级："
        text-class="text-blue-600"
        @done="sendPenalty"
        @cancel="action = ActionType.None"
      >
        <v-select
          v-model="penaltyLevel"
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
import { generateColor } from '@/utils'
import { useEditor } from '@/composables/editor'
import { computed, ref } from 'vue'
import { DetailedFloor, Floor, FloorHistory } from '@/types'
import {
  addFloor,
  addPenalty,
  addReport,
  addSpecialTag,
  deleteFloor,
  getFloorHistory,
  getHole,
  likeFloor,
  modifyFloor,
  restoreFloorFromHistory
} from '@/apis'
import { useDivisionStore } from '@/store'

const props = defineProps<{ floor: Floor }>()
const emit = defineEmits<{
  (e: 'update:floor', floor: Floor): void
  (e: 'newContent'): void
}>()

const floor = computed({
  get: () => props.floor,
  set: (floor: Floor) => emit('update:floor', floor)
})

const histories = ref<FloorHistory[]>([])

const divisionStore = useDivisionStore()

const specialTag = ref('')
const reportReason = ref('')
const deleteReason = ref('')
const penaltyLevel = ref<number | null>(null)

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

const { editorData, initEditor, clearEditor } = useEditor()
const action = ref<ActionType>(ActionType.None)
const computeColorClass = (str: string) => 'text-' + generateColor(str)

const toggleAction = async (type: ActionType) => {
  action.value = action.value === type ? ActionType.None : type
  if (action.value === ActionType.History) {
    histories.value = await getFloorHistory(floor.value.id)
  }
}

const edit = () => {
  specialTag.value = floor.value.specialTag
  initEditor(floor.value.content)
  toggleAction(ActionType.Edit)
}

const reply = () => {
  specialTag.value = ''
  initEditor('')
  toggleAction(ActionType.Reply)
}

const sendReply = async (markdown: string) => {
  await addFloor(floor.value.holeId, {
    content: `##${floor.value.id}\n` + markdown,
    replyTo: floor.value.id,
    specialTag: specialTag.value
  })
  clearEditor()
  emit('newContent')
}

const sendEdit = async (markdown: string) => {
  let res = floor.value
  if (floor.value.content !== markdown) {
    res = await modifyFloor(floor.value.id, markdown)
  }
  if (floor.value.specialTag !== specialTag.value) {
    res = await addSpecialTag(floor.value.id, specialTag.value)
  }
  clearEditor()
  floor.value = res
}

const sendLike = async () => {
  if (floor.value instanceof DetailedFloor && floor.value.liked) {
    floor.value = await likeFloor(floor.value.id, 0)
  } else {
    floor.value = await likeFloor(floor.value.id, 1)
  }
}

const sendReport = async () => {
  action.value = ActionType.None
  await addReport(floor.value.id, reportReason.value)
  reportReason.value = ''
}

const sendDelete = async () => {
  action.value = ActionType.None
  floor.value = await deleteFloor(floor.value.id, deleteReason.value)
}

const sendRestoreHistory = async (history: FloorHistory, reason: string) => {
  floor.value = await restoreFloorFromHistory(floor.value.id, history.id, reason)
  histories.value = await getFloorHistory(floor.value.id)
}

const sendPenalty = async () => {
  if (penaltyLevel.value === null) {
    console.error('Penalty level not selected')
    return
  }
  const divisionId =
    divisionStore.currentDivisionId || (await getHole(floor.value.holeId)).divisionId
  action.value = ActionType.None
  await addPenalty(floor.value.id, penaltyLevel.value, divisionId)
}
</script>

<style lang="scss" scoped></style>
