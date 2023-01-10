<template>
  <div
    v-if="settingsStore.nsfw != 2 && folded"
    class="py-2"
  >
    <div
      class="text-gray-600 hover:bg-neutral-300 hover:bg-opacity-50 -m-1.5 p-1.5 transition cursor-pointer rounded-lg select-none relative before:opacity-0 hover:before:transition-opacity hover:before:content-['expand\_more'] hover:before:md-icon-center hover:before:text-gray-400 hover:before:opacity-70"
      @click="folded = false"
    >
      该内容由于 <span v-html="fold_text"></span> 被折叠
    </div>
  </div>
  <div
    v-else
    class="w-full my-2 hover:text-neutral-500 transition cursor-pointer active:text-neutral-400 focus:ring-0 line-clamp-5"
    @click="$router.push(`/hole/${hole.id}`)"
  >
    {{ plainText(hole.firstFloor.content) }}
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store'
import { Hole } from '@/types'
import { plainText } from '@/utils'
import { computed, ref } from 'vue'

const settingsStore = useSettingsStore()

const props = defineProps<{ hole: Hole }>()
const folded = ref(props.hole.tags.some((tag) => tag.name.startsWith('*')))
const fold_text = computed(() =>
  props.hole.tags
    .filter((tag) => tag.name.startsWith('*'))
    .map((tag) => `<span class="text-red-500">${tag.name}</span>`)
    .join(', ')
)
</script>
