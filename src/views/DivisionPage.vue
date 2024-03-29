<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <!-- TODO: Show Silence Info -->
        <div class="border-b-sm mt-2">
          <div class="text-4xl px-6 lg:px-10 pb-4 lg:pb-8 flex justify-between">
            <div class="flex grow-0">
              {{ divisionStore.getDivisionById(props.divisionId)?.name }}
            </div>
            <v-btn
              class="self-center"
              color="primary"
              @click="createHole"
            >
              发布树洞
            </v-btn>
          </div>

          <template v-if="showCreateHole">
            <v-divider class="mx-6 my-2" />
            <div class="flex justify-center">
              <div
                v-if="userStore.isAdmin"
                class="max-w-[var(--editor-max-width)] flex grow mx-6 lg:ml-11 my-2"
              >
                <span class="self-center font-semibold text-orange-300"> 特殊标签： </span>
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
              :unique-id="'editor-division-' + props.divisionId + '-create-hole'"
              @close="showCreateHole = false"
              @send="sendCreateHole"
            ></Editor>
          </template>
        </div>
        <v-list class="py-0">
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

          <v-list-item>
            <LoadingCircular ref="loader" />
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDivisionStore, useHoleStore, useSettingsStore, useUserStore } from '@/store'
import HoleBlock from '@/components/hole/HoleBlock.vue'
import { addHole } from '@/apis'
import Editor from '@/components/editor/Editor.vue'
import { Tag } from '@/types'
import TagSelector from '@/components/action/TagSelector.vue'
import { sleep } from '@/utils'
import { useNotification } from '@/composables/notification'
import LoadingCircular from '@/components/LoadingCircular.vue'

const props = defineProps<{ divisionId: number }>()
const holeStore = useHoleStore()
const divisionStore = useDivisionStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const not = useNotification()

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
const loader = ref<InstanceType<typeof LoadingCircular>>()

const loadHolesUntil = async (length: number) => {
  loadEnd.value = length
  if (loading.value) return
  loading.value = true
  while (holes.value.length < length && hasNext.value) {
    const res = await loader.value!.load(holeStore.fetchDivisionHoles(props.divisionId))
    hasNext.value = res
  }
  loading.value = false
}

const onIntersect = (index: number) => async (isIntersecting: boolean) => {
  if (isIntersecting && index >= holes.value.length - 5) {
    await loadHolesUntil(holes.value.length + 10)
  }
}

const editorData = ref('')
const showCreateHole = ref(false)
const specialTag = ref('')
const tags = ref<Tag[]>([])

const createHole = async () => {
  editorData.value = ''
  showCreateHole.value = true
}

const sendCreateHole = async (content: string) => {
  if (tags.value.length === 0) {
    not.error('请至少选择一个标签')
    return
  }
  showCreateHole.value = false
  await addHole(props.divisionId, content, tags.value, specialTag.value)
  not.success('发布成功')
  editorData.value = ''
  specialTag.value = ''
  tags.value = []
  holeStore.clearHolesInDivision(props.divisionId)
  hasNext.value = true
  await sleep(1000)
  await loadHolesUntil(10)
}

onMounted(async () => {
  divisionStore.currentDivisionId = props.divisionId
  await loadHolesUntil(10)
})
</script>

<style lang="scss" scoped></style>
