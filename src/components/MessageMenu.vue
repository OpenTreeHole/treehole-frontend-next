<template>
  <div class="px-2 select-none flex relative">
    <v-menu
      :close-on-content-click="false"
      location="center"
    >
      <template #activator="{ props }">
        <v-icon
          class="text-center cursor-pointer text-xl text-[#76839b] hover:text-[#5e68a0]"
          v-bind="props"
        >
          mdi-bell
        </v-icon>
      </template>

      <v-card
        width="400"
        class="relative top-[40px]"
      >
        <div class="px-2 py-2 flex justify-end border-b-sm">
          <IconBtn @click="showRead = !showRead">
            {{ showRead ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
          </IconBtn>
          <IconBtn @click="selecting = !selecting">
            {{ selecting ? 'mdi-pencil-off-outline' : 'mdi-pencil-outline' }}
          </IconBtn>
          <IconBtn
            :class="{
              'text-neutral-200': selectedMessages.length === 0 || !selecting
            }"
            :no-action="selectedMessages.length === 0 || !selecting"
            @click="
              () => {
                if (selectedMessages.length > 0 && selecting) removeSelectedMessages()
              }
            "
          >
            mdi-check-all
          </IconBtn>
        </div>
        <v-list
          class="py-0"
          max-height="400"
        >
          <v-menu
            v-for="(message, i) in messages"
            :key="message.id"
            open-on-hover
            :close-on-content-click="false"
            location="left"
          >
            <template #activator="{ props }">
              <v-list-item
                class="px-4 py-3 select-none"
                :class="{
                  'border-b-sm': i !== messages.length - 1,
                  'hover:bg-neutral-100 cursor-pointer': !!message.data
                }"
                v-bind="props"
                @click="
                  () => {
                    if (selecting) selectMessage(message)
                    else if (message.data instanceof Floor) gotoFloor(message.data)
                    else if (message.data instanceof Report) gotoFloor(message.data.floor)
                  }
                "
              >
                <div class="flex">
                  <div class="pr-2">
                    <v-checkbox
                      v-if="selecting"
                      :model-value="selectedMessages.includes(message.id)"
                      color="indigo"
                      hide-details
                      density="compact"
                    ></v-checkbox>
                  </div>
                  <div class="flex-col grow">
                    <p class="text-sm flex justify-between">
                      <span class="text-neutral-500">
                        <v-icon class="pr-1">{{ parseMessageCode(message.code).icon }}</v-icon>
                        {{ message.message }}
                      </span>
                      <span class="text-neutral-400">
                        {{ timeDifference(message.timeCreated) }}
                      </span>
                    </p>
                    <p>{{ message.description }}</p>
                  </div>
                </div>
              </v-list-item>
            </template>

            <v-card
              v-if="message.data instanceof Floor"
              width="400"
              class="relative right-1 pl-4 pr-2 py-2"
            >
              <FloorBlockHeader :floor="message.data"></FloorBlockHeader>
              <FloorBlockContent :floor="message.data"></FloorBlockContent>
            </v-card>
            <v-card
              v-if="message.data instanceof Report"
              width="400"
              class="relative right-1 pl-4 pr-2 py-2"
            >
              <ReportBlock
                :report="message.data"
                no-action
              ></ReportBlock>
            </v-card>
          </v-menu>

          <template v-if="messages.length === 0">
            <v-list-item class="px-4 py-3">
              <p class="text-sm text-neutral-500">暂无消息</p>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-menu>
    <div
      v-if="unreadMessages.length > 0"
      class="absolute min-w-0 text-white bg-red-500 bottom-[65%] left-[45%] rounded-[20px] border-2 px-1 m-0 text-xs leading-[13.33px]"
    >
      {{ unreadMessages.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import IconBtn from './button/IconBtn.vue'
import { timeDifference } from '@/utils'
import FloorBlockHeader from './floor/FloorBlockHeader.vue'
import FloorBlockContent from './floor/FloorBlockContent.vue'
import { useFloorPortal } from '@/composables/floor'
import { useUserStore } from '@/store'
import { computed, reactive, ref } from 'vue'
import { Message, Floor, Report } from '@/types'
import ReportBlock from './floor/ReportBlock.vue'

const userStore = useUserStore()

const { gotoFloor } = useFloorPortal()

const selecting = ref(false)
const selectedMessages = reactive<number[]>([])
const selectMessage = (message: Message) => {
  if (!selectedMessages.includes(message.id)) {
    selectedMessages.push(message.id)
  } else {
    selectedMessages.splice(selectedMessages.indexOf(message.id), 1)
  }
}

const removeSelectedMessages = async () => {
  await userStore.removeMessages(...selectedMessages)
  selectedMessages.splice(0, selectedMessages.length)
}

const showRead = ref(false)

const unreadMessages = computed(() => userStore.messages.filter((message) => !message.hasRead))

const messages = computed(() => {
  if (showRead.value) {
    return userStore.messages
  } else {
    return unreadMessages.value
  }
})

const parseMessageCode = (
  code:
    | 'favorite'
    | 'reply'
    | 'mention'
    | 'modify'
    | 'permission'
    | 'report'
    | 'report_dealt'
    | 'mail'
) => {
  switch (code) {
    case 'reply':
      return {
        icon: 'mdi-message',
        description: '你的帖子被回复'
      }
    case 'favorite':
      return {
        icon: 'mdi-star',
        description: '你收藏的帖子被回复'
      }
    case 'mention':
      return {
        icon: 'mdi-at',
        description: '提及到你'
      }
    case 'modify':
      return {
        icon: 'mdi-pencil',
        description: '你的帖子被修改'
      }
    case 'permission':
      return {
        icon: 'mdi-shield-account',
        description: '封禁通知'
      }
    case 'report':
      return {
        icon: 'mdi-alert',
        description: '你的帖子被举报'
      }
    case 'report_dealt':
      return {
        icon: 'mdi-alert',
        description: '你的举报被处理'
      }
    case 'mail':
      return {
        icon: 'mdi-email',
        description: '你收到了一封站内信'
      }
  }
}
</script>
