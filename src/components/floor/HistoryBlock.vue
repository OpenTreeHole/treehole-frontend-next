<template>
  <div>
    <div class="w-full flex justify-start">
      <span class="px-2 text-neutral-400 text-sm self-center flex-shrink-1 line-clamp-1">
        由 {{ history.userId }} 修改于 {{ timeDifference(history.timeUpdated) }}
      </span>
      <span class="flex-grow-1"></span>
      <IconBtn @click="restore"> md:settings_backup_restore </IconBtn>
    </div>
    <div
      class="w-full markdown-viewer mt-2 px-2"
      v-html="parseToTypora(history.content)"
    />
    <template v-if="action === ActionType.Restore">
      <div class="flex mx-2">
        <span class="self-center font-semibold text-blue-600">请输入恢复理由：</span>
        <v-text-field
          class="flex-grow-1 mr-2"
          hide-details
          variant="outlined"
          autofocus
          density="compact"
        />
        <IconBtn
          class="self-center text-green"
          small
          @click="$emit('restore')"
        >
          md:done
        </IconBtn>
        <IconBtn
          class="self-center text-red"
          small
          @click="action = ActionType.None"
        >
          md:close
        </IconBtn>
      </div>
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { FloorHistory } from '@/types'
import { timeDifference, parseToTypora } from '@/utils'
import { ref } from 'vue'
import IconBtn from '@/components/button/IconBtn.vue'

defineProps<{ history: FloorHistory }>()
defineEmits<{
  (e: 'restore'): void
}>()

enum ActionType {
  None,
  Restore
}

const action = ref<ActionType>(ActionType.None)

const toggleAction = (type: ActionType) => {
  action.value = action.value === type ? ActionType.None : type
}

const restore = () => {
  toggleAction(ActionType.Restore)
}
</script>

<style
  lang="scss"
  scoped
></style>
