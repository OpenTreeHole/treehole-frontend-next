<template>
  <div class="flex justify-end my-1">
    <div class="border-r-2 px-1">
      <IconBtn
        class="text-neutral-500"
        :text="hole.reply"
        small
        @click="showLastReply = !showLastReply"
      >
        mdi-comment-outline
      </IconBtn>
    </div>
    <div class="text-gray-400 text-sm self-center">
      <span class="pl-2">{{ timeDifference(hole.timeCreated) }}</span>
    </div>
  </div>
  <HoleBlockReply
    v-if="showLastReply"
    :floor="hole.lastFloor"
  />
</template>

<script setup lang="ts">
import { Hole } from '@/types'
import IconBtn from '@/components/button/IconBtn.vue'
import { timeDifference } from '@/utils'
import { ref } from 'vue'
import HoleBlockReply from './HoleBlockReply.vue'

defineProps<{ hole: Hole }>()

const showLastReply = ref(false)
</script>
