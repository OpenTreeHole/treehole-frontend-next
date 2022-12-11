<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <v-list class="py-2">
          <div class="border-b-sm">
            <div class="text-4xl px-6 lg:px-10 pb-8 flex justify-between">
              <div class="flex grow-0">
                {{ divisionStore.getDivisionById(props.divisionId)?.name }}
              </div>
              <v-btn
                class="self-center"
                @click="createHole"
              >
                发布树洞
              </v-btn>
            </div>

            <template v-if="showCreateHole">
              <v-divider class="mx-6 my-2" />
              <div class="flex justify-center">
                <div class="max-w-[var(--editor-max-width)] flex grow mx-6 lg:ml-11 my-2">
                  <span class="self-center font-semibold text-orange-300">特殊标签：</span>
                  <v-text-field
                    v-model="specialTag"
                    class="grow mr-2"
                    hide-details
                    variant="outlined"
                    autofocus
                    density="compact"
                    placeholder="留空则无特殊标签"
                  />
                </div>
              </div>
              <div class="flex justify-center">
                <div class="max-w-[var(--editor-max-width)] flex grow mx-6 lg:ml-11 my-2">
                  <span class="self-center font-semibold text-orange-300"> 标签： </span>
                  <TagSelector
                    v-model="tags"
                    class="grow mr-2"
                  ></TagSelector>
                </div>
              </div>
              <Editor
                class="mx-6"
                :data="editorData"
                @close="showCreateHole = false"
                @send="sendCreateHole"
              ></Editor>
            </template>
          </div>

          <v-list-item
            v-for="hole in pinnedHoles"
            :key="hole.id"
            class="px-0 py-0 border-b-sm flex-col text-left hover:bg-black-700"
          >
            <HoleBlock :hole="hole"></HoleBlock>
          </v-list-item>

          <v-list-item
            v-for="(hole, index) in holes"
            :key="hole.id"
            v-intersect="onIntersect(index)"
            class="px-0 py-0 border-b-sm flex-col text-left hover:bg-black-700"
          >
            <HoleBlock :hole="hole"></HoleBlock>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDivisionStore, useHoleStore, useSettingsStore } from '@/store'
import HoleBlock from '@/components/hole/HoleBlock.vue'
import { useEditor } from '@/composables/editor'
import { addHole } from '@/apis'
import Editor from '@/components/editor/Editor.vue'
import { Tag } from '@/types'
import TagSelector from '@/components/action/TagSelector.vue'
import { sleep } from '@/utils'

const props = defineProps<{ divisionId: number }>()
const holeStore = useHoleStore()
const divisionStore = useDivisionStore()
const settingsStore = useSettingsStore()

const pinnedHoles = computed(
  () => divisionStore.divisions.find((division) => division.id === props.divisionId)!.pinned
)

const holes = computed(() =>
  holeStore
    .getHolesByDivisionId(props.divisionId)
    .filter((hole) => pinnedHoles.value.every((pinned) => pinned.id !== hole.id))
    .filter((hole) =>
      hole.tags.every((tag) => !settingsStore.blockedTags.find((t) => t.name === tag.name))
    )
    .filter((hole) => settingsStore.nsfw != 0 || !hole.tags.some((tag) => tag.name.startsWith('*')))
)

const hasNext = ref(true)
const loading = ref(false)
const loadEnd = ref(0)

const loadHolesUntil = async (length: number) => {
  loadEnd.value = length
  if (loading.value) return
  loading.value = true
  while (holes.value.length < length && hasNext.value) {
    const res = await holeStore.fetchDivisionHoles(props.divisionId)
    hasNext.value = res
  }
  loading.value = false
}

const onIntersect = (index: number) => async (isIntersecting: boolean) => {
  if (isIntersecting && index >= holes.value.length - 5) {
    await loadHolesUntil(index + 10)
  }
}

const { editorData, initEditor, clearEditor } = useEditor()
const showCreateHole = ref(false)
const specialTag = ref('')
const tags = ref<Tag[]>([])

const createHole = async () => {
  initEditor('')
  showCreateHole.value = true
}

const sendCreateHole = async (content: string) => {
  if (tags.value.length === 0) {
    console.error('no tags')
    return
  }
  showCreateHole.value = false
  await addHole(props.divisionId, content, tags.value, specialTag.value)
  clearEditor()
  specialTag.value = ''
  tags.value = []
  holeStore.clearHolesInDivision(props.divisionId)
  hasNext.value = true
  await sleep(1000)
  loadHolesUntil(10)
}

onMounted(() => {
  divisionStore.currentDivisionId = props.divisionId
  loadHolesUntil(10)
})
</script>

<style lang="scss" scoped></style>
