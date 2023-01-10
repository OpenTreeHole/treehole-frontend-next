<template>
  <div class="flex justify-end my-1">
    <template
      v-if="userStore.isAdmin || (hole.firstFloor instanceof DetailedFloor && hole.firstFloor.isMe)"
    >
      <IconBtn
        class="text-neutral-500"
        @click="toggleAction(ActionType.Manage)"
      >
        mdi-cog-outline
      </IconBtn>
      <v-divider
        class="mx-1"
        :vertical="true"
      />
    </template>

    <IconBtn
      class="text-neutral-500"
      :text="hole.reply"
      :no-action="hole.reply === 0"
      @click="hole.reply > 0 && toggleAction(ActionType.LastReply)"
    >
      mdi-comment-outline
    </IconBtn>
    <v-divider
      class="mx-1"
      :vertical="true"
    />
    <div class="text-gray-400 text-sm self-center">
      <span class="pl-2">{{ timeDifference(hole.timeCreated) }}</span>
    </div>
  </div>
  <v-divider
    v-if="action !== ActionType.None"
    class="my-2"
  />
  <HoleBlockReply
    v-if="action == ActionType.LastReply"
    :floor="hole.lastFloor"
  />
  <HoleBlockManage
    v-if="action == ActionType.Manage"
    :hole="hole"
    @close="action = ActionType.None"
  />
</template>

<script setup lang="ts">
import { DetailedFloor, Hole } from '@/types'
import IconBtn from '@/components/button/IconBtn.vue'
import { timeDifference } from '@/utils'
import { ref } from 'vue'
import HoleBlockReply from './HoleBlockReply.vue'
import HoleBlockManage from './HoleBlockManage.vue'
import { useUserStore } from '@/store'

defineProps<{ hole: Hole }>()

const userStore = useUserStore()

enum ActionType {
  None,
  LastReply,
  Manage
}

const action = ref<ActionType>(ActionType.None)

const toggleAction = (type: ActionType) => {
  action.value = action.value === type ? ActionType.None : type
}
</script>
