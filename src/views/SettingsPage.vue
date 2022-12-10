<template>
  <v-container class="px-0">
    <div class="flex lg:px-4">
      <v-col class="max-w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0">
        <div class="text-3xl border-b-2 px-6 pb-8 flex justify-between">
          <div class="flex grow-0">设置</div>
        </div>
        <div class="mt-4 text-left px-6">
          <p class="text-xl font-semibold">屏蔽</p>
          <div
            class="grid mt-3 gap-x-2 gap-y-4"
            style="grid-template-columns: auto 1fr"
          >
            <span class="self-center">NSFW：</span>
            <v-radio-group
              v-model="nsfw"
              inline
              hide-details
            >
              <v-radio
                class="contain-paint mr-5"
                :value="0"
                label="隐藏"
              ></v-radio>
              <v-radio
                class="contain-paint mr-5"
                :value="1"
                label="折叠"
              ></v-radio>
              <v-radio
                class="contain-paint mr-5"
                :value="2"
                label="显示"
              ></v-radio>
            </v-radio-group>
            <span>已屏蔽以下标签：</span>
            <div class="flex-wrap flex gap-2">
              <TagChip
                v-for="(tag, index) in blockedTags"
                :key="index"
                :tag="tag"
                class="cursor-pointer"
                @click="blockedTags.splice(index, 1)"
              ></TagChip>
            </div>
            <span class="self-center">添加标签：</span>
            <TagSelector
              v-model="tempTags"
              :filter-tags="blockedTags"
            />
          </div>
        </div>
        <v-divider class="my-4" />
        <div class="mt-4 text-left px-6">
          <p class="text-xl font-semibold">主题</p>
          <div class="flex mt-3 items-center">
            <span>是否开启夜间模式：</span>
            <v-switch
              v-model="styleStore.dark"
              hide-details
              :label="styleStore.dark ? '夜间模式开启' : '夜间模式关闭'"
              color="white"
            />
          </div>
        </div>
      </v-col>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import TagChip from '@/components/tag/TagChip.vue'
import { computed, ref, watch } from 'vue'
import { useStyleStore, useTagStore } from '@/store'
import TagSelector from '@/components/action/TagSelector.vue'

const styleStore = useStyleStore()
const tagStore = useTagStore()

const blockedTags = computed({
  get: () => tagStore.blockedTags,
  set: (val) => {
    tagStore.blockedTags = val
  }
})

const nsfw = ref(2)

const tempTags = ref([])

watch(
  () => tempTags.value,
  (newVal) => {
    if (newVal.length > 0) {
      blockedTags.value = [...blockedTags.value, ...newVal]
      tempTags.value = []
    }
  }
)
</script>

<style lang="scss" scoped></style>
