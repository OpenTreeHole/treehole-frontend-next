<template>
  <div class="w-full">
    <div class="flex grow lg:mx-6 my-2">
      <span class="self-center font-semibold text-orange-300">标签：</span>
      <TagSelector
        v-model="tags"
        class="grow"
      ></TagSelector>
    </div>
    <div class="flex grow lg:mx-6 my-2">
      <span class="self-center font-semibold">分区：</span>
      <v-select
        v-model="division"
        class="grow"
        hide-details
        :items="divisionStore.divisions"
        item-title="name"
        variant="outlined"
        density="compact"
        return-object
      ></v-select>
    </div>
    <div class="flex grow lg:mx-6 my-2 space-x-8">
      <div class="flex grow">
        <span class="self-center font-semibold">置顶：</span>
        <span class="grow"></span>
        <v-switch
          v-model="pinned"
          class="grow-0"
          hide-details
          color="blue"
        ></v-switch>
      </div>
      <div class="flex grow">
        <span class="self-center font-semibold">隐藏：</span>
        <span class="grow"></span>
        <v-switch
          v-model="hidden"
          class="grow-0"
          hide-details
          color="blue"
        ></v-switch>
      </div>
    </div>
    <div class="flex grow justify-end">
      <v-btn
        class="mr-3"
        @click="$emit('close')"
      >
        取消
      </v-btn>
      <v-btn
        class="text-white bg-blue-500"
        @click="sendModifyHole"
      >
        发送
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDivisionStore, useHoleStore } from '@/store'
import { Hole } from '@/types'
import { computed, ref } from 'vue'
import TagSelector from '@/components/action/TagSelector.vue'
import { modifyHoleDivision, modifyHoleHidden, modifyHoleTag } from '@/apis'
import { useNotification } from '@/composables/notification'

const props = defineProps<{ hole: Hole }>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const not = useNotification()

const holeStore = useHoleStore()
const divisionStore = useDivisionStore()

const hole = computed({
  get: () => props.hole,
  set: (hole: Hole) => {
    holeStore.updateHole(hole)
  }
})

const tags = ref([...hole.value.tags])
const pinned = ref(
  divisionStore
    .getDivisionById(hole.value.divisionId)!
    .pinned.some((pinned) => pinned.id === hole.value.id)
)
const hidden = ref(hole.value.hidden)
const division = ref(divisionStore.getDivisionById(hole.value.divisionId)!)

const sendModifyHole = async () => {
  emit('close')
  let newHole = hole.value
  if (
    tags.value.length !== hole.value.tags.length ||
    tags.value.some((tag) => !hole.value.tags.includes(tag))
  ) {
    newHole = await modifyHoleTag(hole.value.id, tags.value)
  }
  if (division.value.id !== hole.value.divisionId) {
    console.log(division.value)
    newHole = await modifyHoleDivision(hole.value.id, division.value.id)
  }
  if (hidden.value !== hole.value.hidden) {
    newHole = await modifyHoleHidden(hole.value.id, hidden.value)
  }
  hole.value = newHole

  if (
    pinned.value !==
    divisionStore
      .getDivisionById(hole.value.divisionId)!
      .pinned.some((pinned) => pinned.id === hole.value.id)
  ) {
    let pinnedIds = divisionStore
      .getDivisionById(hole.value.divisionId)!
      .pinned.map((pinned) => pinned.id)
    if (pinned.value) pinnedIds.push(hole.value.id)
    else pinnedIds = pinnedIds.filter((id) => id !== hole.value.id)
    await divisionStore.modifyDivision(hole.value.divisionId, {
      pinned: pinnedIds
    })
  }

  not.success('修改成功')

  await divisionStore.fetchDivisions()
}
</script>
