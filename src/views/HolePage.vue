<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <div class="border-b-sm mt-2 pb-4">
          <div class="text-3xl px-6 lg:px-10 pb-2 flex justify-between">
            <div class="flex grow-0">#{{ holeId }}</div>
            <div class="flex space-x-4">
              <v-btn
                color="primary"
                @click="comment"
                >发表评论</v-btn
              >
              <v-btn
                class="self-center"
                color="primary"
                @click="toggleFavorite"
              >
                {{ isFavorite ? '已收藏' : '收藏' }}
              </v-btn>
            </div>
          </div>
          <div
            v-if="tags.length > 0"
            class="px-6 lg:px-10 pb-2 flex"
          >
            <TagChip
              v-for="(tag, index) in tags"
              :key="index"
              class="mr-2"
              :tag="tag"
            ></TagChip>
          </div>
          <template v-if="showComment">
            <v-divider class="mx-6 my-2" />
            <div class="flex justify-center">
              <div
                v-if="userStore.isAdmin"
                class="max-w-[var(--editor-max-width)] flex grow mx-6 lg:ml-11"
              >
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
            <Editor
              class="mx-6"
              :data="editorData"
              @close="showComment = false"
              @send="sendComment"
            ></Editor>
          </template>
        </div>

        <v-list class="py-0">
          <v-list-item
            v-for="(floor, index) in floors"
            :id="floor.id"
            :key="`##${floor.id}, ${floor.fold}`"
            v-intersect="onIntersect(index)"
            class="px-0 py-5 border-b-sm flex-col text-left"
          >
            <FloorBlock
              v-model:floor="floors[index]"
              class="px-6 lg:px-10"
              @new-content="onNewContent"
            />
          </v-list-item>

          <v-list-item>
            <LoadingCircular ref="loader" />
          </v-list-item>
        </v-list>
      </div>
      <!-- <div class="hidden lg:block lg:max-w-[35%] xl:max-w-[30%] 3xl:max-w-[25%] pl-5 pt-4 grow">
        <v-card
          class="mx-auto py-2"
          max-width="368"
        >
          <v-card-item>
            <v-card-title class="text-h5 text-left px-1 font-semibold">相关讨论</v-card-title>
          </v-card-item>

          <v-divider />

          <v-card-text class="text-lg text-left">
            <p class="px-1 py-2">#123124</p>
          </v-card-text>
        </v-card>
      </div> -->
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { Floor, Hole } from '@/types'
import { sleep } from '@/utils'
import FloorBlock from '@/components/floor/FloorBlock.vue'
import Editor from '@/components/editor/Editor.vue'
import TagChip from '@/components/tag/TagChip.vue'
import { useEditor } from '@/composables/editor'
import { onMounted, provide, ref, computed, reactive } from 'vue'
import { addFloor, getHole, listFloors } from '@/apis'
import { useDivisionStore, useUserStore } from '@/store'
import { useFloorPortal } from '@/composables/floor'
import { useNotification } from '@/composables/notification'
import LoadingCircular from '@/components/LoadingCircular.vue'

const props = defineProps<{ holeId: number; floorId?: number }>()

const hole = ref<Hole | null>(null)

const floors = reactive<Floor[]>([])

const tags = computed(() => hole.value?.tags || [])

const divisionStore = useDivisionStore()
const userStore = useUserStore()

const not = useNotification()

const { editorData, initEditor, clearEditor } = useEditor()

const { gotoFloor } = useFloorPortal()

const scrollToFloor = (floor: Floor | number) => {
  const floorId = typeof floor === 'number' ? floor : floor.id
  const floorElement = document.getElementById(floorId.toString())
  if (floorElement) window.scroll({ top: floorElement.offsetTop, behavior: 'smooth' })
  else gotoFloor(floor)
}

provide('scrollToFloor', scrollToFloor)

const isFavorite = computed(() => {
  return userStore.favorites.some((favorite) => favorite.id === props.holeId)
})

const toggleFavorite = async () => {
  if (isFavorite.value) {
    await userStore.removeFavorite(props.holeId)
    not.success('取消收藏成功')
  } else {
    await userStore.addFavorite(props.holeId)
    not.success('收藏成功')
  }
}

const hasNext = ref(true)
const loading = ref(false)
const loadEnd = ref(0)
const loader = ref<InstanceType<typeof LoadingCircular>>()

const loadFloorsUntil = async (length: number) => {
  loadEnd.value = length
  if (loading.value) return
  loading.value = true
  while (floors.length < loadEnd.value && hasNext.value) {
    const res = await loader.value!.load(listFloors(props.holeId, 50, floors.length))
    if (res.length < 50) hasNext.value = false
    floors.push(...res)
  }
  loading.value = false
}

const onIntersect = (index: number) => async (isIntersecting: boolean) => {
  if (isIntersecting && index >= floors.length - 25) {
    await loadFloorsUntil(index + 50)
  }
}

const onNewContent = async () => {
  hasNext.value = true
  await loadFloorsUntil(floors.length + 50)
}

const specialTag = ref('')
const showComment = ref(false)
const comment = () => {
  initEditor('')
  showComment.value = true
}

const sendComment = async (content: string) => {
  showComment.value = false
  await addFloor(props.holeId, {
    content,
    specialTag: specialTag.value
  })
  not.success('发表成功')
  clearEditor()
  specialTag.value = ''
  onNewContent()
}

onMounted(async () => {
  hole.value = await getHole(props.holeId)
  await loadFloorsUntil(50)
  divisionStore.currentDivisionId = hole.value?.divisionId || null
  if (props.floorId) {
    while (floors.every((floor) => floor.id !== props.floorId))
      await loadFloorsUntil(floors.length + 50)
    await sleep(100)
    scrollToFloor(props.floorId)
  }
})
</script>
