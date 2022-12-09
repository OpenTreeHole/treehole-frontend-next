<template>
  <div>
    <div class="flex justify-end mt-2 overflow-visible">
      <IconBtn @click="toggleAction(ActionType.Delete)">md:delete</IconBtn>
      <IconBtn @click="toggleAction(ActionType.Penalty)">md:person_off</IconBtn>
      <v-divider
        class="mx-1"
        :vertical="true"
      />
      <IconBtn @click="toggleAction(ActionType.Deal)">mdi-check-outline</IconBtn>
    </div>
    <v-divider
      v-if="action !== ActionType.None"
      class="my-2"
    />
    <template v-if="action === ActionType.Delete">
      <QuestionAction
        class="mt-4"
        text="确认删除？"
        text-class="text-red"
        @cancel="action = ActionType.None"
      />
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
    <template v-else-if="action === ActionType.Deal">
      <QuestionAction
        text="处理结果："
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuestionAction from '@/components/action/QuestionAction.vue'
import IconBtn from '@/components/button/IconBtn.vue'

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
</script>

<style lang="scss" scoped></style>
