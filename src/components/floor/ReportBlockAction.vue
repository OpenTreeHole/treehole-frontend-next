<template>
  <div>
    <div class="flex justify-end py-2 overflow-visible">
      <IconBtn @click="toggleAction(ActionType.Delete)">mdi-delete-outline</IconBtn>
      <IconBtn @click="toggleAction(ActionType.Penalty)">mdi-account-off-outline</IconBtn>
      <v-divider
        class="mx-1 border-gray-800"
        :vertical="true"
      />
      <IconBtn
        :no-action="report.dealt"
        :icon-class="{ 'text-neutral-400': report.dealt }"
        @click="
          () => {
            if (!report.dealt) toggleAction(ActionType.Deal)
          }
        "
      >
        mdi-check-outline
      </IconBtn>
    </div>
    <v-divider
      v-if="action !== ActionType.None"
      class="my-2"
    />
    <template v-if="action === ActionType.Delete">
      <QuestionAction
        class="mt-4"
        text="请输入删除理由："
        text-class="text-red"
        @done="sendDelete"
        @cancel="action = ActionType.None"
      >
        <v-text-field
          v-model="deleteReason"
          class="grow mr-2"
          hide-details
          variant="outlined"
          :autofocus="true"
          density="compact"
        />
      </QuestionAction>
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
    <template v-else-if="action === ActionType.Deal">
      <QuestionAction
        text="处理结果："
        text-class="text-blue-600"
        @done="sendDeal"
        @cancel="action = ActionType.None"
      >
        <v-text-field
          v-model="dealResult"
          class="grow mr-2"
          hide-details
          variant="outlined"
          :autofocus="true"
          density="compact"
        />
      </QuestionAction>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import QuestionAction from '@/components/action/QuestionAction.vue'
import IconBtn from '@/components/button/IconBtn.vue'
import { Report } from '@/types'
import { addPenalty, dealReport, deleteFloor, getHole } from '@/apis'
import { useNotification } from '@/composables/notification'

const props = defineProps<{ report: Report }>()
const emit = defineEmits<{
  (e: 'update:report', report: Report): void
  (e: 'deal'): void
}>()

const not = useNotification()

const report = computed({
  get: () => props.report,
  set: (report: Report) => emit('update:report', report)
})

enum ActionType {
  None,
  Delete,
  Penalty,
  Deal
}

const action = ref<ActionType>(ActionType.None)

const toggleAction = (type: ActionType) => {
  action.value = action.value === type ? ActionType.None : type
}

const deleteReason = ref('')
const penaltyLevel = ref<number | null>(null)
const dealResult = ref('')

const sendDelete = async () => {
  action.value = ActionType.None
  report.value.floor = await deleteFloor(report.value.floor.id, deleteReason.value)
  not.success('删除成功')
}

const sendPenalty = async () => {
  if (penaltyLevel.value === null) {
    not.error('请选择封禁等级')
    return
  }
  action.value = ActionType.None
  const hole = await getHole(report.value.floor.holeId)
  await addPenalty(report.value.floor.id, penaltyLevel.value, hole.divisionId)
  not.success('封禁成功')
}

const sendDeal = async () => {
  if (dealResult.value === '') {
    not.error('请输入处理结果')
    return
  }
  action.value = ActionType.None
  report.value = await dealReport(report.value.id, dealResult.value)
  not.success('处理成功')
  emit('deal')
}
</script>

<style lang="scss" scoped></style>
