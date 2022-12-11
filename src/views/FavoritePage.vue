<template>
  <v-container class="px-0 pt-0">
    <div class="flex">
      <div class="w-full lg:max-w-[65%] 3xl:max-w-[55%] px-0 pt-4 grow">
        <v-list class="py-2">
          <div class="border-b-sm">
            <div class="text-4xl px-6 lg:px-10 pb-8 flex justify-between">
              <div class="flex grow-0">收藏</div>
            </div>
          </div>
          <v-list-item
            v-for="hole in holes"
            :key="hole.id"
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
import { onMounted, ref } from 'vue'
import HoleBlock from '@/components/hole/HoleBlock.vue'
import { Hole } from '@/types'
import { getFavorites } from '@/apis'

const holes = ref<Hole[]>([])

onMounted(async () => {
  holes.value = await getFavorites()
})
</script>

<style lang="scss" scoped></style>
