<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <div class="border-b-sm mt-2">
          <div class="text-3xl px-6 lg:px-10 pb-4 lg:pb-8 flex justify-between">
            <div class="flex grow-0">搜索 {{ searchText }} 的结果：</div>
          </div>
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
            />
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
import { Floor } from '@/types'
import FloorBlock from '@/components/floor/FloorBlock.vue'
import { onMounted, provide, ref, reactive } from 'vue'
import { searchFloors } from '@/apis'
import { useFloorPortal } from '@/composables/floor'
import LoadingCircular from '@/components/LoadingCircular.vue'

const props = defineProps<{ searchText: string }>()

const floors = reactive<Floor[]>([])

const { gotoFloor } = useFloorPortal()

provide('scrollToFloor', gotoFloor)

const hasNext = ref(true)
const loading = ref(false)
const loadEnd = ref(0)
const loader = ref<InstanceType<typeof LoadingCircular>>()

const loadFloorsUntil = async (length: number) => {
  loadEnd.value = length
  if (loading.value) return
  loading.value = true
  while (floors.length < loadEnd.value && hasNext.value) {
    const res = await loader.value!.load(searchFloors(props.searchText, 50, floors.length))
    if (res.length < 50) hasNext.value = false
    floors.push(...res)
  }
  loading.value = false
}

const onIntersect = (index: number) => async (isIntersecting: boolean) => {
  if (isIntersecting && index >= floors.length - 25) {
    await loadFloorsUntil(floors.length + 50)
  }
}

onMounted(async () => {
  await loadFloorsUntil(50)
})
</script>
