<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <v-list class="py-2">
          <div class="border-b-sm">
            <div class="text-3xl px-6 lg:px-10 pb-2 flex justify-between">
              <div class="flex grow-0">#{{ holeId }}</div>
              <v-btn @click="initEditor('')">发表评论</v-btn>
            </div>
            <div
              v-if="hole?.tags"
              class="px-6 lg:px-10 pb-2 flex"
            >
              <TagChip
                v-for="(tag, index) in hole?.tags"
                :key="index"
                class="mr-2"
                :tag="tag"
              ></TagChip>
            </div>
            <template v-if="editorData">
              <v-divider class="mx-6 my-2" />
              <div class="flex justify-center">
                <div class="max-w-[var(--editor-max-width)] flex grow mx-6 lg:ml-11">
                  <span class="self-center font-semibold text-orange-400">
                    特殊标签（留空则无特殊标签）：
                  </span>
                  <v-text-field
                    class="grow mr-2"
                    hide-details
                    variant="outlined"
                    autofocus
                    density="compact"
                  />
                </div>
              </div>
              <Editor
                class="mx-6"
                :data="editorData"
                @close="clearEditor"
              ></Editor>
            </template>
          </div>

          <v-list-item
            v-for="(floor, index) in floors"
            :id="floor.id"
            :key="index"
            class="px-0 py-5 border-b-sm flex-col text-left"
          >
            <FloorBlock
              class="px-6 lg:px-10"
              :floor="floor"
            />
          </v-list-item>
        </v-list>
      </div>
      <div class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5 pt-4 grow">
        <v-card
          class="mx-auto py-2"
          max-width="368"
        >
          <v-card-item>
            <v-card-title class="text-h5 text-left px-1 font-semibold">相关讨论</v-card-title>
          </v-card-item>

          <v-divider />

          <v-card-text class="text-lg text-left">
            <p class="px-1 py-2">
              #123124
              <!-- <TagChip
                class="mx-2"
                :tag="tags[0]"
              ></TagChip> -->
            </p>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Hole } from '@/types'
import { sleep } from '@/utils'
import FloorBlock from '@/components/floor/FloorBlock.vue'
import Editor from '@/components/editor/Editor.vue'
import TagChip from '@/components/tag/TagChip.vue'
import { useEditor } from '@/composables/editor'
import { onMounted, provide, ref, computed } from 'vue'
import { getHole } from '@/apis'
import { useDivisionStore } from '@/store'

const props = defineProps<{ holeId: number; floorId?: number }>()

const hole = ref<Hole | null>(null)

const floors = computed(() => hole.value?.floors || [])

const tags = computed(() => hole.value?.tags || [])
console.log(tags.value)

const divisionStore = useDivisionStore()

const { editorData, initEditor, clearEditor } = useEditor()

const scrollToFloor = (id: number) => {
  const floorElement = document.getElementById(id.toString())
  if (floorElement) window.scroll({ top: floorElement.offsetTop, behavior: 'smooth' })
}

provide('scrollToFloor', scrollToFloor)
provide('holeId', props.holeId)

onMounted(async () => {
  hole.value = await getHole(props.holeId)
  divisionStore.currentDivisionId = hole.value?.divisionId || null
  if (props.floorId) {
    await sleep(100)
    scrollToFloor(props.floorId)
  }
})
</script>
