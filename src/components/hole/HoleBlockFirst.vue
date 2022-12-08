<template>
  <div class="w-full flex flex-wrap items-center gap-y-2">
    <TagChip
      v-for="(tag, tagIndex) in hole.tags"
      :key="tagIndex"
      class="mr-2"
      size="small"
      :tag="tag"
    ></TagChip>
    <div class="grow flex justify-end space-x-3">
      <SpecialFlagChip
        :text="hole.firstFloor.specialTag"
        color="red"
        size="small"
      ></SpecialFlagChip>
      <HoleActionMenu
        :size="24"
        icon="mdi-chevron-down"
      ></HoleActionMenu>
    </div>
  </div>
  <div class="w-full my-2">
    {{ hole.firstFloor.content }}
  </div>
  <div class="flex justify-between text-sm text-gray-400 my-1">
    <div class="text-neutral-400">
      <span class="pr-2 border-r-2">#114514</span>
      <span class="pl-2">发布于 2022/7/21</span>
    </div>
    <div class="flex space-x-2 items-center">
      <IconBtn
        class="px-0"
        text="810"
      >
        mdi-comment-outline
      </IconBtn>
      <IconBtn class="px-0">mdi-bookmark-outline</IconBtn>
      <span>
        <HoleActionMenu
          :size="20"
          icon="mdi-dots-horizontal"
        ></HoleActionMenu>
      </span>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { Hole } from '@/types'
import SpecialFlagChip from '@/components/tag/SpecialFlagChip.vue'
import HoleActionMenu from '@/components/menu/HoleActionMenu.vue'
import TagChip from '@/components/tag/TagChip.vue'
import IconBtn from '@/components/button/IconBtn.vue'

defineProps<{ hole: Hole }>()
</script>
