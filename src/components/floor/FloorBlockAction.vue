<template>
  <div>
    <div class="flex justify-end py-2">
      <IconBtn
        :icon-class="
          floor instanceof DetailedFloor && floor.liked ? 'text-red-500' : 'text-neutral-400'
        "
        :text="floor.like"
        @click="sendLike"
      >
        mdi-thumb-up-outline
      </IconBtn>
      <IconBtn
        :icon-class="
          floor instanceof DetailedFloor && floor.disliked ? 'text-red-500' : 'text-neutral-400'
        "
        :text="floor.dislike"
        @click="sendDislike"
      >
        mdi-thumb-down-outline
      </IconBtn>
      <IconBtn @click="reply"> mdi-chat-outline </IconBtn>
      <v-divider
        class="mx-1 border-gray-800"
        :vertical="true"
      />
      <IconBtn
        v-if="userStore.isAdmin || (floor instanceof DetailedFloor && floor.isMe)"
        @click="edit"
      >
        mdi-pencil-outline
      </IconBtn>
      <IconBtn
        v-if="userStore.isAdmin"
        @click="toggleAction(ActionType.Fold)"
      >
        mdi-folder-off-outline
      </IconBtn>
      <IconBtn
        v-if="userStore.isAdmin || (floor instanceof DetailedFloor && floor.isMe)"
        @click="toggleAction(ActionType.Delete)"
      >
        mdi-delete-outline
      </IconBtn>
      <IconBtn
        v-if="userStore.isAdmin"
        @click="toggleAction(ActionType.Penalty)"
      >
        mdi-account-off-outline
      </IconBtn>
      <IconBtn
        v-if="userStore.isAdmin"
        @click="toggleAction(ActionType.History)"
      >
        mdi-history
      </IconBtn>
      <v-divider
        v-if="userStore.isAdmin || (floor instanceof DetailedFloor && floor.isMe)"
        class="mx-1 border-gray-800"
        :vertical="true"
      />
      <IconBtn @click="toggleAction(ActionType.Report)"> mdi-alert-octagon-outline </IconBtn>
    </div>
    <v-divider
      v-if="action !== ActionType.None"
      class="my-2"
    />
    <template v-if="action === ActionType.Reply || action === ActionType.Edit">
      <div class="flex justify-center">
        <div
          v-if="userStore.isAdmin"
          class="lg:ml-5 mr-2 max-w-[var(--editor-max-width)] flex grow"
        >
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
        :unique-id="'editor-floor' + floor.id + (action === ActionType.Reply ? '-reply' : '-edit')"
        @close="action = ActionType.None"
        @send="
          (content: string) => {
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
        class="mt-4"
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
          placeholder="举报理由不可为空"
        />
      </QuestionAction>
    </template>
    <template v-else-if="action === ActionType.Fold">
      <QuestionAction
        class="mt-4"
        :text="floor.fold ? '解除折叠？' : '请输入折叠理由：'"
        text-class="text-red"
        @done="sendFold"
        @cancel="action = ActionType.None"
      >
        <v-text-field
          v-if="!floor.fold"
          v-model="foldReason"
          class="grow mr-2"
          hide-details
          variant="outlined"
          :autofocus="true"
          density="compact"
          placeholder="折叠理由不可为空"
        />
        <span
          v-else
          class="grow"
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
        <span
          v-else
          class="grow"
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
            @restore="(reason: string) => sendRestoreHistory(history, reason)"
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
        class="mt-4"
        text="请输入封禁天数："
        text-class="text-blue-600"
        @done="sendPenalty"
        @cancel="action = ActionType.None"
      >
        <v-text-field
          v-model="penaltyDays"
          class="grow mr-2"
          hide-details
          variant="outlined"
          :autofocus="true"
          density="compact"
          type="number"
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
import { computed, ref } from 'vue'
import { DetailedFloor, Floor, FloorHistory } from '@/types'
import {
  addFloor,
  addPenalty,
  addReport,
  addSpecialTag,
  deleteFloor,
  foldFloor,
  getFloorHistory,
  getHole,
  likeFloor,
  modifyFloor,
  restoreFloorFromHistory
} from '@/apis'
import { useDivisionStore, useUserStore } from '@/store'
import { useNotification } from '@/composables/notification'

const props = defineProps<{ floor: Floor }>()
const emit = defineEmits<{
  (e: 'update:floor', floor: Floor): void
  (e: 'newContent'): void
}>()

const not = useNotification()

const floor = computed({
  get: () => props.floor,
  set: (floor: Floor) => emit('update:floor', floor)
})

const histories = ref<FloorHistory[]>([])

const divisionStore = useDivisionStore()
const userStore = useUserStore()

const specialTag = ref('')
const reportReason = ref('')
const foldReason = ref('')
const deleteReason = ref('')
const penaltyDays = ref('1')

enum ActionType {
  None,
  Edit,
  Reply,
  Report,
  Fold,
  Delete,
  History,
  Penalty,
  Tag,
  Division
}

const editorData = ref('')

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
  editorData.value = floor.value.content
  toggleAction(ActionType.Edit)
}

const reply = () => {
  specialTag.value = ''
  editorData.value = ''
  toggleAction(ActionType.Reply)
}

const sendReply = async (markdown: string) => {
  await addFloor(floor.value.holeId, {
    content: `##${floor.value.id}\n` + markdown,
    replyTo: floor.value.id,
    specialTag: specialTag.value
  })
  not.success('回复成功')
  editorData.value = ''
  specialTag.value = ''
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
  not.success('修改成功')
  editorData.value = ''
  specialTag.value = ''
  floor.value = res
}

const sendLike = async () => {
  if (floor.value instanceof DetailedFloor && floor.value.liked) {
    floor.value = await likeFloor(floor.value.id, 0)
  } else {
    floor.value = await likeFloor(floor.value.id, 1)
  }
}

const sendDislike = async () => {
  if (floor.value instanceof DetailedFloor && floor.value.disliked) {
    floor.value = await likeFloor(floor.value.id, 0)
  } else {
    floor.value = await likeFloor(floor.value.id, -1)
  }
}

const sendReport = async () => {
  if (reportReason.value === '') {
    not.error('举报理由不能为空')
    return
  }
  action.value = ActionType.None
  await addReport(floor.value.id, reportReason.value)
  not.success('举报成功')
  reportReason.value = ''
}

const sendFold = async () => {
  if (!floor.value.fold && foldReason.value === '') {
    not.error('折叠理由不能为空')
    return
  }
  action.value = ActionType.None
  floor.value = await foldFloor(floor.value.id, foldReason.value)
  not.success('折叠成功')
  foldReason.value = ''
}

const sendDelete = async () => {
  action.value = ActionType.None
  floor.value = await deleteFloor(floor.value.id, deleteReason.value)
  deleteReason.value = ''
}

const sendRestoreHistory = async (history: FloorHistory, reason: string) => {
  floor.value = await restoreFloorFromHistory(floor.value.id, history.id, reason)
  not.success('恢复成功')
  histories.value = await getFloorHistory(floor.value.id)
}

const sendPenalty = async () => {
  if (penaltyDays.value === '') {
    not.error('请输入封禁天数')
    return
  } else if (parseInt(penaltyDays.value) <= 0) {
    not.error('封禁天数必须大于0')
    return
  }
  const divisionId =
    divisionStore.currentDivisionId || (await getHole(floor.value.holeId)).divisionId
  action.value = ActionType.None
  await addPenalty(floor.value.id, parseInt(penaltyDays.value), divisionId)
  not.success('封禁成功')
  penaltyDays.value = '1'
}
</script>

<style lang="scss" scoped></style>
